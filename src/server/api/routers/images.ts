import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { list } from "~/server/controllers/images";

export const imagesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ max: z.number().optional() }))
    .query(({ ctx, input }) => {
      return list(input);
    }),
});
