import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clients, orders, orderItems, schedules, Client, InsertClient, Order, InsertOrder, OrderItem, InsertOrderItem, Schedule, InsertSchedule } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== CLIENTS ==========

export async function getClientsByUserId(userId: number): Promise<Client[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(clients).where(and(eq(clients.userId, userId), eq(clients.isActive, 1)));
}

export async function getClientById(clientId: number, userId: number): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clients).where(and(eq(clients.id, clientId), eq(clients.userId, userId))).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createClient(data: InsertClient): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(clients).values(data);
  return (result as any).insertId as number;
}

export async function updateClient(clientId: number, userId: number, data: Partial<InsertClient>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(clients).set(data).where(and(eq(clients.id, clientId), eq(clients.userId, userId)));
}

export async function deleteClient(clientId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(clients).set({ isActive: 0 }).where(and(eq(clients.id, clientId), eq(clients.userId, userId)));
}

// ========== ORDERS ==========

export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderById(orderId: number, userId: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.userId, userId))).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createOrder(data: InsertOrder): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(orders).values(data);
  return (result as any).insertId as number;
}

export async function updateOrder(orderId: number, userId: number, data: Partial<InsertOrder>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set(data).where(and(eq(orders.id, orderId), eq(orders.userId, userId)));
}

export async function deleteOrder(orderId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orders).set({ status: "cancelled" }).where(and(eq(orders.id, orderId), eq(orders.userId, userId)));
}

// ========== ORDER ITEMS ==========

export async function getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId)).orderBy(orderItems.order);
}

export async function createOrderItem(data: InsertOrderItem): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(orderItems).values(data);
  return (result as any).insertId as number;
}

export async function updateOrderItem(itemId: number, data: Partial<InsertOrderItem>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(orderItems).set(data).where(eq(orderItems.id, itemId));
}

export async function deleteOrderItem(itemId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(orderItems).where(eq(orderItems.id, itemId));
}

// ========== SCHEDULES ==========

export async function getSchedulesByUserId(userId: number): Promise<Schedule[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(schedules).where(eq(schedules.userId, userId)).orderBy(desc(schedules.startDate));
}

export async function getSchedulesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Schedule[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(schedules).where(and(eq(schedules.userId, userId)));
}

export async function getScheduleById(scheduleId: number, userId: number): Promise<Schedule | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(schedules).where(and(eq(schedules.id, scheduleId), eq(schedules.userId, userId))).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createSchedule(data: InsertSchedule): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(schedules).values(data);
  return (result as any).insertId as number;
}

export async function updateSchedule(scheduleId: number, userId: number, data: Partial<InsertSchedule>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(schedules).set(data).where(and(eq(schedules.id, scheduleId), eq(schedules.userId, userId)));
}

export async function deleteSchedule(scheduleId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(schedules).where(and(eq(schedules.id, scheduleId), eq(schedules.userId, userId)));
}
