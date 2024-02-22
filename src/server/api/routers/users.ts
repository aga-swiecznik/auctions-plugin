import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { list, add } from "~/server/controllers/users";

export const usersRouter = createTRPCRouter({
  list: protectedProcedure
    .query(({ ctx }) => {
      return list(ctx.db);
    }),
  add: protectedProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(({ ctx, input }) => {
      return add(ctx.db, input);
    }),
  });
