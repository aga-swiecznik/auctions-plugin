import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { list, add } from "~/server/controllers/fb-users";

export const fbUsersRouter = createTRPCRouter({
  list: publicProcedure
    .query(({ ctx }) => {
      return list(ctx.db);
    }),
  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return add(ctx.db, input);
    }),
  });
