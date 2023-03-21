import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { type Post } from "@prisma/client";
interface DisplayPost extends Post {
    author:string;
    authorId:string;
    createdAt: Date;
    id: number;
    recipient: string;
    title: string;
    message: string;
}
/*
model Post {
    id        Int      @id @default(autoincrement())
    createdAt DateTime @default(now())
    message   String   @default("")
    recipient String   @default("")
    author    User     @relation(fields: [authorId], references: [id])
    authorId  String
}

model User {
    id            String    @id @default(cuid())
    name          String?
    email         String?   @unique
    emailVerified DateTime?
    image         String?
    accounts      Account[]
    sessions      Session[]
    posts         Post[]
}

*/
const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
});
const postSchema = z.object({
    id: z.number(),
    createdAt: z.string().datetime(),
    message: z.string(),
    recipient: z.string(),
    authorId: z.string(),
    authorPic: z.string()
});

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
            // const validAuthor = postSchema.parse(author);
            res.push({...posts[i], author: name});
            console.log(author.name);
        }
        console.log(res);
        return res;
    } catch (error) {
        
    }
  }),
  postShout: protectedProcedure
  .input(z.object({ created_at: z.string().datetime().optional(), message: z.string(), recipient: z.string(), title: z.string(), authorPic: z.string() }))
  .mutation(async ({ input, ctx }) => {
    try {
        console.log('attempting to add to database');
        await ctx.prisma.post.create({
          data: {
            authorId: ctx.session?.user.id,
            message: input.message,
            recipient: input.recipient,
            createdAt: input.created_at,
            title: input.title,
            authorPic: input.authorPic,
          }
        })
    } catch (error) {
        console.log('error', error);
    }
  }),

  getSecretMessage: protectedProcedure.query(( {}) => {
    return "you can now see this secret message!";
  }),
});
