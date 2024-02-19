import { auctionRouter } from "~/server/api/routers/auction";
import { fbUsersRouter } from "~/server/api/routers/fb-users";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auction: auctionRouter,
  fbUsers: fbUsersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
