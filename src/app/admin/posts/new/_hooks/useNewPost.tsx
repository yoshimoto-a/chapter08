"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Category } from "@/app/_types/Post";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export const useNewPost = (thumbnailImageKey: string) => {
  interface Inputs {
    title: string;
    content: string;
    thumbnailImageKey: string;
    categories: Category[];
  }
  const router = useRouter();
  const { token } = useSupabaseSession();
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
      thumbnailImageKey: "",
      categories: [],
    },
  });

  const throwError = () => {
    throw new Error("error");
  };

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const categoryIds = data.categories.map(item => item.id);
    if (!token) return;

    const prams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        thumbnailImageKey: thumbnailImageKey,
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
        console.log(e);
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
