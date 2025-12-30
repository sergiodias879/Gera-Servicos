import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, clients, orders, orderItems, schedules, Client, InsertClient, Order, InsertOrder, OrderItem, InsertOrderItem, Schedule, InsertSchedule } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: any = null;

// Lazily create the drizzle instance
export async function getDb() {
  if (!_db) {
    try {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
      }
      
      const client = postgres(connectionString, { prepare: false });
      _db = drizzle(client);
      console.log("[Database] Supabase (PostgreSQL) connection established");
    } catch (error) {
      console.error("[Database] Failed to connect to Supabase:", error);
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
  if (!db) return;

  try {
    await db.insert(users).values(user).onConflictDoUpdate({
      target: users.openId,
      set: {
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
        lastSignedIn: user.lastSignedIn || new Date(),
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

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

  const result = await db.insert(clients).values(data).returning({ id: clients.id });
  return result[0].id;
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

  const result = await db.insert(orders).values(data).returning({ id: orders.id });
  return result[0].id;
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

  const result = await db.insert(orderItems).values(data).returning({ id: orderItems.id });
  return result[0].id;
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

export async function getScheduleById(scheduleId: number, userId: number): Promise<Schedule | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(schedules).where(and(eq(schedules.id, scheduleId), eq(schedules.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSchedule(data: InsertSchedule): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(schedules).values(data).returning({ id: schedules.id });
  return result[0].id;
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
