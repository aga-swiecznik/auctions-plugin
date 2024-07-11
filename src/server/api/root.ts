import { auctionRouter } from "~/server/api/routers/auction";
import { fbUsersRouter } from "~/server/api/routers/fb-users";
import { usersRouter } from "~/server/api/routers/users";
import { commonRouter } from "~/server/api/routers/common";
import { imagesRouter } from "~/server/api/routers/images";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auction: auctionRouter,
  fbUsers: fbUsersRouter,
  users: usersRouter,
  common: commonRouter,
  images: imagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
