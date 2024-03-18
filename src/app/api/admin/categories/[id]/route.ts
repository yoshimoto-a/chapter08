/*管理者記事詳細取得API */
/*管理者記事詳細更新API */
/*管理者記事詳細削除API */
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = req.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) return Response.json({ status: error.message }, { status: 400 });
  const { id } = params;
  try {
    const post = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const PUT = async (req: Request) => {
  const token = req.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) return Response.json({ status: error.message }, { status: 400 });
  const body = await req.json();
  const { id, name } = body;
  try {
    const post = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return Response.json({ status: 200, id: id });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ status: 400, message: e.message });
    }
  }
};

export const DELETE = async (req: Request) => {
  const token = req.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error) return Response.json({ status: error.message }, { status: 400 });
  try {
    const body = await req.json();
    const { id } = body;
    const deletePost = await prisma.category.delete({
      where: { id },
    });
    return Response.json({ status: 200, message: "カテゴリーを削除しました" });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json(
        { status: 400, message: e.message },
        { status: 400 }
      );
    }
  }
};
