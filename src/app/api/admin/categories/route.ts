/*管理者カテゴリー新規作成API */
/*管理者カテゴリー一覧取得API */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async(req: Request) => {
  try{
    const body = await req.json();
    const { name } = body;
    const post = await prisma.category.create({
      data: {
        name,
      }
    });

    return Response.json({ status:200, id: post.id, message: "カテゴリーを追加しました" })
  }catch(e) {
    if (e instanceof Error) {
      return Response.json({ status: 400, message: e.message }, { status: 400 });
    }
  }
}

export const GET = async() => {
  try{
    const categories = await prisma.category.findMany();
    return Response.json({status:200,data:categories})
  }catch(e) {
    if (e instanceof Error) {
      return Response.json({ status: e.message }, { status: 400 })
    }
  }
}