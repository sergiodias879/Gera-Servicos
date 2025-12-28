import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========== CLIENTS ==========
  clients: router({
    list: protectedProcedure.query(({ ctx }) => {
      return db.getClientsByUserId(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ ctx, input }) => {
        return db.getClientById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          phone: z.string().max(20).optional(),
          email: z.string().email().optional(),
          address: z.string().optional(),
          cpfCnpj: z.string().max(20).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        return db.createClient({
          userId: ctx.user.id,
          ...input,
          isActive: 1,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).max(255).optional(),
          phone: z.string().max(20).optional(),
          email: z.string().email().optional(),
          address: z.string().optional(),
          cpfCnpj: z.string().max(20).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateClient(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => {
        return db.deleteClient(input.id, ctx.user.id);
      }),
  }),

  // ========== ORDERS ==========
  orders: router({
    list: protectedProcedure.query(({ ctx }) => {
      return db.getOrdersByUserId(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ ctx, input }) => {
        return db.getOrderById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          clientId: z.number(),
          title: z.string().min(1).max(255),
          description: z.string().optional(),
          address: z.string().min(1),
          status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
          scheduledDate: z.date().optional(),
          scheduledTime: z.string().max(5).optional(),
          value: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        return db.createOrder({
          userId: ctx.user.id,
          ...input,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().optional(),
          address: z.string().optional(),
          status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
          scheduledDate: z.date().optional(),
          scheduledTime: z.string().max(5).optional(),
          completedAt: z.date().optional(),
          value: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateOrder(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => {
        return db.deleteOrder(input.id, ctx.user.id);
      }),
  }),

  // ========== ORDER ITEMS ==========
  orderItems: router({
    list: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(({ input }) => {
        return db.getOrderItemsByOrderId(input.orderId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          title: z.string().min(1).max(255),
          description: z.string().optional(),
          order: z.number().default(0),
        })
      )
      .mutation(({ input }) => {
        return db.createOrderItem({
          ...input,
          isCompleted: 0,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().optional(),
          isCompleted: z.number().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateOrderItem(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        return db.deleteOrderItem(input.id);
      }),
  }),

  // ========== SCHEDULES ==========
  schedules: router({
    list: protectedProcedure.query(({ ctx }) => {
      return db.getSchedulesByUserId(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ ctx, input }) => {
        return db.getScheduleById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          orderId: z.number().optional(),
          title: z.string().min(1).max(255),
          description: z.string().optional(),
          startDate: z.date(),
          endDate: z.date().optional(),
          location: z.string().optional(),
          type: z.enum(["service", "meeting", "break", "other"]).default("service"),
          reminderMinutes: z.number().default(15),
        })
      )
      .mutation(({ ctx, input }) => {
        return db.createSchedule({
          userId: ctx.user.id,
          ...input,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          location: z.string().optional(),
          type: z.enum(["service", "meeting", "break", "other"]).optional(),
          reminderMinutes: z.number().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateSchedule(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => {
        return db.deleteSchedule(input.id, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
