import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  addMsg: publicProcedure
  .input(z.object({ text: z.string() }))
  .query(async ({ input, ctx }) => {
    await ctx.prisma.example.create({
      data: {
        msg: input.text
      }
    })
    return {
      greeting: `msg added`,
    };
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(( {}) => {
    return "you can now see this secret message!";
  }),
});
