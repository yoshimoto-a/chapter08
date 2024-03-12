/*管理者編集ページ */
"use client";

import { useApi } from "@/app/_hooks/useApi";
import { useParams } from 'next/navigation';
import { usePutPost } from './_hooks/usePutPost';
import { Category } from "@/app/_types/Post";
import { Post as PostType } from "@/app/_types/Post";
import { useDeletePost } from "./_hooks/useDeletePost";

  const PutPost: React.FC = () => {
  const { id } = useParams();
  const url = `/api/posts/${id}`;
  const endPoint = `/api/admin/posts/[id]`
  const {
    register,
    handleSubmit,
    onSubmit,
    formState: { isSubmitting },
  } = usePutPost(endPoint, Number(id));
  
  //ボタンを押されたら更新
  const {isDeleting, deletePost} = useDeletePost(endPoint, Number(id));
  //投稿内容取得
  const {data: postData, isLoading: postLoading}= useApi(url,{method:"GET"});
  //カテゴリー取得
  const categoriesUrl = "/api/admin/categories"
  const {data: categoryData, isLoading: categoryLoading} = useApi(categoriesUrl,{method:"GET"});

  if (postLoading) return <div>読み込み中...</div>;
  if (categoryLoading) return <div>読み込み中...</div>;

  const { post }: { post: PostType } = postData;
  const { data }: { data: Category[] } = categoryData;

  const defaultCategories:object[] = [];
  data.map(item => {
    defaultCategories.push({ id: item.id.toString(), name: item.name })
  })
  
  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("削除してもよろしいですか？");
    confirmDelete ? deletePost() : null
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
            defaultValue={post.title}
            disabled={isSubmitting||isDeleting}
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
              defaultValue={post.content}
              disabled={isSubmitting||isDeleting}
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
            disabled={isSubmitting||isDeleting}
            defaultValue={post.thumbnailUrl}
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
            defaultValue={defaultCategories.toString()}
            {...register("categories")}
          >
            {data.map(item => (
              <option key={item.id} value={JSON.stringify({ id: item.id, name: item.name })}>{item.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="flex">
        <button
          type="submit"
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4"
          disabled={isSubmitting||isDeleting}
        >
          登録
        </button>
        <button
          type="button"
          className="bg-red-800 text-white font-bold py-2 px-4 rounded-lg"
          disabled={isSubmitting||isDeleting}
          onClick={handleDeletePost}
        >
          削除
        </button>
      </div>
      </form>
    </div>
  )
}

export default PutPost;
