import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { summary, fetchData } from "~/server/controllers/common";

export const commonRouter = createTRPCRouter({
  fetch: publicProcedure
    .query(({ ctx }) => {
      return fetchData(ctx.db);
    }),
  summary: publicProcedure
    .query(({ ctx }) => {
      return summary(ctx.db);
    }),
});
