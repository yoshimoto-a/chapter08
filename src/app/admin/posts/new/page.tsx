/*管理者新規作成ページ */
"use client";
import { useNewPost } from "./_hooks/useNewPost";
import { Category } from "@/app/_types/Post";
import React, { ChangeEvent } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useState, useEffect } from "react";
import { supabase } from "@/_utils/supabase";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

const NewPost: React.FC = () => {
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const {
    register,
    handleSubmit,
    onSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useNewPost(thumbnailImageKey);

  const categoriesUrl = "/api/admin/categories";
  const { token } = useSupabaseSession();
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

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

  useEffect(() => {
    if (!thumbnailImageKey) return;

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);
      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  if (isLoading) return <div>読み込み中...</div>;
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
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return;
    }
    const file = event.target.files[0]; // 選択された画像を取得
    const filePath = `private/${uuidv4()}`; // ファイルパスを指定
    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail") // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }
    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path);
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
            type="file"
            id="thumbnailImageKey"
            className="pt-4 w-full mb-4"
            accept="image/*"
            onChange={handleImageChange}
          ></input>
        </div>
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
        <label htmlFor="title" className="w-[240px]">
          カテゴリー
        </label>
        <div className="relative">
          <select
            id="categories"
            className="border border-gray-300 rounded-lg p-4 w-full appearance-none mb-4"
            multiple
            onChange={onChange}
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
