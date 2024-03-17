/*記事一覧取得API */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const getPosts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json({ status: 200, posts: getPosts });
  } catch (e) {
    return Response.json({ status: 400, e });
  }
};
