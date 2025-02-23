import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { list, add, listWithInfo, get, save, reassign } from "~/server/controllers/fb-users";

export const fbUsersRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ fundraisingId: z.string() }))
    .query(({ ctx, input }) => {
      return list(ctx.db, input.fundraisingId);
    }),
  listWithInfo: protectedProcedure
    .input(z.object({ fundraisingId: z.string() }))
    .query(({ ctx, input }) => {
      return listWithInfo(ctx.db, input.fundraisingId);
    }),
  add: protectedProcedure
    .input(z.object({ name: z.string(), fundraisingId: z.string() }))
    .mutation(({ ctx, input }) => {
      return add(ctx.db, input);
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string(), fundraisingId: z.string() }))
    .query(({ ctx, input }) => {
      return get(ctx.db, input);
    }),
  save: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), fundraisingId: z.string() }))
    .mutation(({ ctx, input }) => {
      return save(ctx.db, input);
    }),
  reassign: protectedProcedure
    .input(z.object({ id: z.string(), newId: z.string() }))
    .mutation(({ ctx, input }) => {
      return reassign(ctx.db, input);
    }),
});
