
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { list, get } from "~/server/controllers/fundraisings";

export const fundraisingsRouter = createTRPCRouter({
  list: protectedProcedure
    .query(({ ctx }) => {
      return list(ctx.db, ctx.session.user.id);
    }),
  get: protectedProcedure
    .input(z.object({ fundraisingId: z.string(), }))
    .query(({ ctx, input }) => {
      return get(ctx.db, ctx.session.user.id, input.fundraisingId);
    }),
});
