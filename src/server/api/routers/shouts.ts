import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { type Post } from "@prisma/client";
interface DisplayPost extends Post {
    author:string
}

export const shoutsRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
        const posts = await ctx.prisma.post.findMany();
        const res: DisplayPost[] = [];
        for(let i = 0; i < posts.length; i++) {
            const author = await ctx.prisma.user.findFirstOrThrow({
                where: {
                    id: posts[i]?.authorId}});
            const name = author !== null ? author.name : "";
            res.push({...posts[i], author: name});
            console.log(author.name);
        }
        console.log(res);
        return res;
    } catch (error) {
        
    }
  }),
  postShout: protectedProcedure
  .input(z.object({ created_at: z.string().datetime().optional(), message: z.string(), recipient: z.string() }))
  .query(async ({ input, ctx }) => {
    await ctx.prisma.post.create({
      data: {
        authorId: ctx.session?.user.id,
        message: input.message,
        recipient: input.recipient,
        createdAt: input.created_at,
      }
    })
  }),

  getSecretMessage: protectedProcedure.query(( {}) => {
    return "you can now see this secret message!";
  }),
});
