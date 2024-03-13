"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Category } from "@/app/_types/Post";
import { useRouter } from "next/navigation";
import type { Post } from "@/app/_types/Post";

export const usePutPost = (url: string, id: Number, post: Post) => {
  interface Inputs {
    title: string;
    content: string;
    thumbnailUrl: string;
    categories: Category[];
  }
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      title: post.title,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      categories: post.postCategories,
    },
  });

  const throwError = () => {
    throw new Error("error");
  };

  const onSubmit: SubmitHandler<Inputs> = async data => {
    interface category {
      id: number;
      name: string;
    }
    let categoryIds: category[] = [];
    let jsonData;
    //カテゴリーのidを配列に入れる
    data.categories.map(item => {
      jsonData = JSON.parse(item.toString());
      categoryIds.push(jsonData.id);
    });
    console.log(categoryIds);
    const prams = {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        categoryIds: categoryIds,
      }),
    };
    try {
      const resp = await fetch(url, prams);
      const contents = await resp.json();
      if (contents.status === 200) {
        window.alert("登録に成功しました");
        router.push("/admin/posts");
      } else {
        throwError();
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        window.alert("登録に失敗しました");
      }
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    formState: { isSubmitting },
  };
};
