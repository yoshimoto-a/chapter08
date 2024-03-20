/*管理者カテゴリー新規作成API */
/*管理者カテゴリー一覧取得API */
import { supabase } from "@/_utils/supabase";
import { buildPrisma } from "@/_utils/prisma";

export const POST = async (req: Request) => {
  const prisma = await buildPrisma();
  const token = req.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) return Response.json({ status: error.message }, { status: 400 });
  try {
    const body = await req.json();
    const { name } = body;
    const post = await prisma.category.create({
      data: {
        name,
      },
    });

    return Response.json({
      status: 200,
      id: post.id,
      message: "カテゴリーを追加しました",
    });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json(
        { status: 400, message: e.message },
        { status: 400 }
      );
    }
  }
};

export const GET = async (req: Request) => {
  const prisma = await buildPrisma();
  const token = req.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) return Response.json({ status: error.message }, { status: 400 });
  try {
    const categories = await prisma.category.findMany();
    return Response.json({ status: 200, data: categories });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ status: e.message }, { status: 400 });
    }
  }
};
