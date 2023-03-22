import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { type Post } from "@prisma/client";
import { Input } from "postcss";
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


  getBatch: publicProcedure
  .input(
    z.object({
      limit: z.number(),
      // cursor is a reference to the last item in the previous batch
      // it's used to fetch the next batch
      cursor: z.number().nullish(),
      skip: z.number().optional(),
      categoryId: z.number().optional(),
    })
  )
  .query(async({ ctx, input }) => {
    console.log(input, 'input')
    const { limit, skip, cursor } = input;
    const items = await ctx.prisma.post.findMany({
      take: limit + 1,
      skip: skip,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        id: 'desc',
      },
      include: {
        author: {
            select: {
                name:true,
            }
        }
    },
    });
    let nextCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop(); // return the last item from the array
      nextCursor = nextItem?.id;
    }
    return {
      items,
      nextCursor,
    };
  }),

  getAll: publicProcedure
  .input(z.object({ id: z.number().optional() }))
    .query(async ({ input, ctx }) => {
    try {
      console.log(input)
        // sort the data 
        //if start id not provided
        if(!input.id){
            //get the posts with the largest 15 ids
            const posts = await ctx.prisma.post.findMany({
                take: 10,
                orderBy: 
                {
                id: 'desc',
                },
                include: {
                    author: {
                        select: {
                            name:true,
                        }
                    }
                },
            });
            return posts;
            
        } else {
          const postLength = await ctx.prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name:true,
                    }
                }
            },
        });
            const posts = await ctx.prisma.post.findMany({
                take: 10,
                cursor: {
                  id: (postLength.length - input.id)
                },
                orderBy:
                {
                  id: 'desc',
                },
                include: {
                  author: {
                    select: {
                      name:true,
                    }
                  }
                },
              });
          return posts;
        }
        // const posts = await ctx.prisma.post.findMany();
        // const res: DisplayPost[] = [];
        // for(let i = posts.length - 1; i >= 0; i--) {
        //     const author = await ctx.prisma.user.findFirstOrThrow({
        //         where: {
        //             id: posts[i]?.authorId}});
        //     const name = author !== null ? author.name : "";
        //     // const validAuthor = postSchema.parse(author);
        //     res.push({...posts[i], author: name});
        //     console.log(author.name);
        // }
        // // console.log(res);
        // return res;
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
  deleteShout: protectedProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input, ctx }) => {
    try{
      console.log('deleting message');
      //todo why deletemany?????
      await ctx.prisma.post.deleteMany({
        where: {
            id: input.id,
            authorId: ctx.session?.user.id,
        }
      })
      return 'success';
    } catch (error) {
      console.log('error', error);
    }
  }),

  updateShout: protectedProcedure
  .input(z.object({ id: z.number(), message: z.string(), recipient: z.string(), title: z.string(), created_at: z.string().datetime().optional() }))
  .mutation(async ({ input, ctx }) => {
    try{
      console.log('deleting message');
      // why delete many instead of delete?
      await ctx.prisma.post.updateMany({
        where: {
            id: input.id,
            authorId: ctx.session?.user.id,
        },
        data: {
            authorId: ctx.session?.user.id,
            message: input.message,
            recipient: input.recipient,
            createdAt: input.created_at,
            title: input.title,
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