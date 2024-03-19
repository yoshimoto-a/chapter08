/*管理者記事新規作成API */
/*管理者記事一覧取得API */
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  const token = req.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) return Response.json({ status: error.message }, { status: 400 });
  try {
    const body = await req.json();
    console.log(body);
    const { title, content, categoryIds, thumbnailImageKey } = body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categoryIds) {
      await prisma.postCategory.create({
        data: {
          categoryId: category,
          postId: post.id,
        },
      });
    }
    return Response.json({ status: 200, id: post.id });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return Response.json({ status: 400, message: e.message });
    }
  }
};

export const GET = async (req: Request) => {
  const token = req.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) return Response.json({ status: error.message }, { status: 400 });
  try {
    const getPosts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json({ status: 200, posts: getPosts });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
      return Response.json({ status: 400, e });
    }
  }
};
