/*処理まとめたい*/
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: Request) => {
  try {
    const getPost = await prisma.post.findMany({
      where: {
        id: 268,
      },
    });
    console.log(getPost);
    return Response.json({ getPost });
  } catch (e) {
    console.log(e);
  }
};

export const PUT = async (req: Request) => {
  const body = await req.json;
  console.log(body);
  try {
    const putPost = await prisma.post.update({
      where: {
        id: 24,
      },
      data: {
        content: "",
      },
    });
    console.log(putPost);
    return Response.json({ putPost });
  } catch (e) {
    console.log(e);
  }
};

export const DELETE = async (req: Request) => {
  try {
    const deletePost = await prisma.post.delete({
      where: {
        id: 288,
      },
    });
    console.log(deletePost);
    return Response.json({ deletePost });
  } catch (e) {
    console.log(e);
  }
};

export const POST = async (req: Request) => {
  try {
    let post: Prisma.PostCreateInput;
    post = {
      title: "テスト3",
      content: "AAAAAAAAAAAAAAAAAAAAAAAA",
      thumbnailImageKey: "https://placehold.jp/800×400.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      postCategories: {},
    };
    const createPost = await prisma.post.create({
      data: post,
    });
    console.log(createPost);
    return Response.json({ createPost });
  } catch (e) {
    console.log(e);
  }
};
