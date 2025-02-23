
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { list } from "~/server/controllers/fundraisings";

export const fundraisingsRouter = createTRPCRouter({
  list: protectedProcedure
    .query(({ ctx }) => {
      return list(ctx.db, ctx.session.user.id);
    }),
});
