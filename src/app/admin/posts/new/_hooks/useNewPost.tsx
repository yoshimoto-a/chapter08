"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Category } from "@/app/_types/Post";
import { useRouter } from "next/navigation";

export const useNewPost = (url: string) => {
  interface Inputs {
    title: string;
    contents: string;
    thumbnailUrl: string;
    categories: Category[];
  }

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>({});

  const throwError = () => {
    throw new Error("error");
  };

  const onSubmit: SubmitHandler<Inputs> = async data => {
    let aryCategory: number[] = [];
    let jsonData;
    //カテゴリーのidを配列に入れる
    data.categories.map(item => {
      jsonData = JSON.parse(item.toString());
      aryCategory.push(jsonData.id);
    });

    const prams = {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        content: data.contents,
        thumbnailUrl: data.thumbnailUrl,
        postCategories: aryCategory,
      }),
    };
    try {
      const url = "/api/admin/posts";
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
