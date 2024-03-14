/*管理者記事詳細取得API */
/*管理者記事詳細更新API */
/*管理者記事詳細削除API */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//変　finduniqeにする
export const GET = async (req: Request) => {
  try {
    const body = await req.json();
    const { id } = body;
    const getPost = await prisma.post.findUnique({
      where: { id },
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
      return Response.json({ status: 400, e });
    }
  }
};

export const PUT = async (req: Request) => {
  const body = await req.json();
  const { id, title, content, categoryIds, thumbnailUrl } = body;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    // 一旦、記事とカテゴリーの中間テーブルのレコードを全て削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categoryIds) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category,
        },
      });
    }
    return Response.json({ status: 200, id: id });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ status: 400, e });
    }
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { id } = await req.json();
    const deletePost = await prisma.post.delete({
      where: { id },
    });
    return Response.json({ status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return Response.json({ status: 400, e });
    }
  }
};
