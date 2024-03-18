/*管理者新規作成ページ */
"use client";
import { useNewPost } from "./_hooks/useNewPost";
import { Category } from "@/app/_types/Post";
import React from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useState, useEffect } from "react";

const NewPost: React.FC = () => {
  const url = "/api/admin/posts/new";
  const {
    register,
    handleSubmit,
    onSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useNewPost(url);

  const categoriesUrl = "/api/admin/categories";
  const { token } = useSupabaseSession();
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      setLoading(true);
      const resp = await fetch(categoriesUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await resp.json();
      setData(data);
      setLoading(false);
    };
    fetcher();
  }, [token]);

  if (isLoading) return <div>読み込み中...</div>;
  console.log(data);
  const { data: categories }: { data: Category[] } = data;

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      <h1 className="text-xl font-bold mb-10">記事作成</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="title" className="w-[240px]">
          タイトル
        </label>
        <div className="w-full">
          <input
            type="text"
            id="title"
            className="border border-gray-300 rounded-lg p-4 w-full mb-4"
            {...register("title")}
          ></input>
        </div>
        <label htmlFor="content" className="w-[240px]">
          内容
        </label>
        <div className="w-full">
          <textarea
            id="contents"
            className="w-full border border-gray-300 rounded-lg p-4 mb-4"
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
            defaultValue="https://placehold.jp/800x400.png"
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
            onChange={onChange}
            // {...register("categories")}
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
        <button
          type="submit"
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4"
          disabled={isSubmitting}
        >
          作成
        </button>
      </form>
    </div>
  );
};
export default NewPost;
