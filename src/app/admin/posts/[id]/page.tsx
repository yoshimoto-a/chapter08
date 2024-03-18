/*管理者編集ページ */
"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Category } from "@/app/_types/Post";
import { Post, PostCategory } from "@prisma/client";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

interface Inputs {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: Category[];
}

const PutPost: React.FC = () => {
  const { id }: { id: string } = useParams();
  const endPoint = `/api/admin/posts/[id]`;
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { token } = useSupabaseSession();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      title: "",
      content: "",
      thumbnailUrl: "",
      categories: [],
    },
  });

  interface PostResponse {
    status: number;
    post: Post & {
      postCategories: (PostCategory & { category: Category })[];
    };
  }

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      setLoading(true);
      const resp = await fetch(`/api/admin/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { post }: PostResponse = await resp.json();
      reset({
        title: post.title,
        content: post.content,
        thumbnailUrl: post.thumbnailUrl,
        categories: post.postCategories.map(postCategory => {
          return {
            id: postCategory.category.id,
            name: postCategory.category.name,
          };
        }),
      });
      setLoading(false);
    };
    fetcher();
  }, [reset, token]);

  interface CategoryResponse {
    status: number;
    data: Category[];
  }

  useEffect(() => {
    if (!token) return;
    const fetcher = async () => {
      const categoryResp = await fetch("/api/admin/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 👈 Header に token を付与
        },
      });
      const { data }: CategoryResponse = await categoryResp.json();
      setCategories(data);
    };
    fetcher();
  }, [token]);

  if (isLoading) return <div>読み込み中...</div>;

  const handleDeletePost = async () => {
    if (!token) return;

    const confirmDelete = window.confirm("削除してもよろしいですか？");
    if (!confirmDelete) return;
    setIsDeleting(true);
    const prams = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ id: parseInt(id) }),
    };
    const data = await fetch(endPoint, prams);
    const { status } = await data.json();
    setIsDeleting(false);
    if (status === 200) {
      window.alert("削除に成功しました");
      router.push("/admin/posts");
    } else {
      window.alert("削除に失敗しました");
      console.log(status);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async data => {
    if (!token) return;
    try {
      const prams = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 👈 Header に token を付与
        },
        body: JSON.stringify({
          id: parseInt(id),
          title: data.title,
          content: data.content,
          thumbnailUrl: data.thumbnailUrl,
          categoryIds: data.categories.map(item => item.id),
        }),
      };
      const resp = await fetch(`/api/admin/posts/${id}`, prams);
      const contents = await resp.json();
      if (contents.status === 200) {
        window.alert("登録に成功しました");
        router.push("/admin/posts");
      } else {
        window.alert("登録に失敗しました");
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        window.alert("登録に失敗しました");
      }
    }
  };

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const isSelected = watch("categories")
      .map(c => c.id)
      .includes(id);

    if (isSelected) {
      const newCategories = watch("categories").filter(c => c.id !== id);
      setValue("categories", newCategories);
    } else {
      const category = categories.find(c => c.id === id);
      setValue("categories", [...watch("categories"), category as Category]);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">記事編集</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="title" className="w-[240px]">
          タイトル
        </label>
        <div className="w-full">
          <input
            type="text"
            id="title"
            className="border border-gray-300 rounded-lg p-4 w-full mb-4"
            disabled={isSubmitting || isDeleting}
            {...register("title")}
          ></input>
        </div>
        <label htmlFor="contents" className="w-[240px]">
          内容
        </label>
        <div className="w-full">
          <textarea
            id="contents"
            className="w-full border border-gray-300 rounded-lg p-4 mb-4"
            disabled={isSubmitting || isDeleting}
            {...register("content")}
          ></textarea>
        </div>
        <label htmlFor="title" className="w-[240px]">
          サムネイルURL
        </label>
        <div className="w-full">
          <input
            type="text"
            id="thumbnailUrl"
            className="border border-gray-300 rounded-lg p-4 w-full mb-4"
            disabled={isSubmitting || isDeleting}
            {...register("thumbnailUrl")}
          ></input>
        </div>
        <label htmlFor="title" className="w-[240px]">
          カテゴリー
        </label>
        <div className="relative">
          <select
            id="categories"
            className="border border-gray-300 rounded-lg p-4 w-full appearance-none mb-4"
            multiple
            onChange={handleSelectCategory}
          >
            {categories.map(item => {
              const isSelected = watch("categories")
                .map(c => c.id)
                .includes(item.id);

              return (
                <option key={item.id} value={item.id}>
                  {item.name} {isSelected ? "✅" : ""}
                </option>
              );
            })}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <div className="flex">
          <button
            type="submit"
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4"
            disabled={isSubmitting || isDeleting}
          >
            登録
          </button>
          <button
            type="button"
            className="bg-red-800 text-white font-bold py-2 px-4 rounded-lg"
            disabled={isSubmitting || isDeleting}
            onClick={handleDeletePost}
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
};

export default PutPost;
