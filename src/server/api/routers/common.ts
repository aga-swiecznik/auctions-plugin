import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { summary, fetchData, fullAmountStats } from "~/server/controllers/common";

export const commonRouter = createTRPCRouter({
  fetch: publicProcedure
    .query(({ ctx }) => {
      return fetchData(ctx.db);
    }),
  summary: publicProcedure
    .query(({ ctx }) => {
      return summary(ctx.db);
    }),
  amounts: publicProcedure
  .query(({ ctx }) => {
    return fullAmountStats(ctx.db);
  })
});
