import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { list, add, listWithInfo, get, save, reassign } from "~/server/controllers/fb-users";

export const fbUsersRouter = createTRPCRouter({
  list: protectedProcedure
    .query(({ ctx }) => {
      return list(ctx.db);
    }),
  listWithInfo: protectedProcedure
    .query(({ ctx }) => {
      return listWithInfo(ctx.db);
    }),
  add: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return add(ctx.db, input);
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return get(ctx.db, input);
    }),
  save: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      return save(ctx.db, input);
    }),
  reassign: protectedProcedure
    .input(z.object({ id: z.string(), newId: z.string() }))
    .mutation(({ ctx, input }) => {
      return reassign(ctx.db, input);
    }),
});
