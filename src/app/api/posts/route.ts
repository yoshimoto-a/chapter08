/*記事一覧取得API */
import { buildPrisma } from "@/_utils/prisma";

export const GET = async () => {
  const prisma = await buildPrisma();
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
