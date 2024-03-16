/*管理者記事詳細取得API */
/*管理者記事詳細更新API */
/*管理者記事詳細削除API */
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  console.log(id); //取得出来ている
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
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

    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const PUT = async (req: Request) => {
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
