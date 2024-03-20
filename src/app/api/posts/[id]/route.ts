/*記事詳細取得API*/
import { buildPrisma } from "@/_utils/prisma";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const prisma = await buildPrisma();
  try {
    const { id } = params;
    const postId = parseInt(id);
    const getPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
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
    });
    return Response.json({ status: 200, post: getPost });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ status: 400, message: e.message });
    }
  }
};
