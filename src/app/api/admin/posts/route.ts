/*管理者記事新規作成API */
/*管理者記事一覧取得API */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, content, categoryIds, thumbnailUrl } = body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categoryIds) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: post.id,
        },
      });
    }
    return Response.json({ status: 200, id: post.id });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ status: 400, message: e.message });
    }
  }
};

export const GET = async () => {
  try {
    const getPosts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json({ status: 200, posts: getPosts });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ status: 400, e });
    }
  }
};
