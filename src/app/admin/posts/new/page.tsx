/*管理者新規作成ページ */
"use client";

import { useApi } from "@/app/_hooks/useApi";
import { useNewPost } from "./_hooks/useNewPost";
import type { Category } from "@prisma/client";

const NewPost: React.FC = () => {
  const url = "/api/admin/posts/new";
  const {
    register,
    handleSubmit,
    onSubmit,
    formState: { isSubmitting },
  } = useNewPost(url);
  
  const categoriesUrl = "/api/admin/categories"
  const {data , isLoading} = useApi(categoriesUrl,{ method:"GET" });

  if (isLoading) return <div>読み込み中...</div>;
  const { data : name } : { data: Category[] } = data;

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
        <label htmlFor="contents" className="w-[240px]">
          内容
        </label>
        <div className="w-full">
          <textarea
            id="contents"
            className="w-full border border-gray-300 rounded-lg p-4 mb-4"
            {...register("contents")}
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
            defaultValue={[]}
            multiple
            {...register("categories")}
          >
            {name.map(item => (
              <option key={item.id} value={JSON.stringify({ id: item.id, name: item.name })}>{item.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
  )
}
export default NewPost;
