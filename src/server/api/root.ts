import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { shoutsRouter } from "@/server/api/routers/shouts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  shouts: shoutsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
