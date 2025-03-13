import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { list, add, edit, remove } from "~/server/controllers/texts";

export const textsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ fundraisingId: z.string() }))
    .query(({ ctx, input }) => {
      return list(ctx.db, input.fundraisingId);
    }),
  add: protectedProcedure
    .input(z.object({ 
      text: z.string(), 
      type: z.enum(['winning', 'no-offers']),
      fundraisingId: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return add(ctx.db, input);
    }),
  edit: protectedProcedure
    .input(z.object({ 
      id: z.string(), 
      text: z.string(), 
      type: z.enum(['winning', 'no-offers']),
      fundraisingId: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return edit(ctx.db, input);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), fundraisingId: z.string() }))
    .mutation(({ ctx, input }) => {
      return remove(ctx.db, input);
    }),
});
