"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Category } from "@/app/_types/Post";
import { useRouter } from "next/navigation";

export const useNewPost = (url: string) => {
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
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      title: "",
      content: "",
      thumbnailUrl: "https://placehold.jp/800x400.png",
      categories: [],
    },
  });

  const throwError = () => {
    throw new Error("error");
  };

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const categoryIds = data.categories.map(item => item.id);

    const prams = {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        categoryIds,
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
    watch,
    setValue,
    formState: { isSubmitting },
  };
};
