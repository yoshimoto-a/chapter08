/*管理者編集ページ */
"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Category } from "@/app/_types/Post";
import { Post, PostCategory } from "@prisma/client";

interface PostForm {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: Category[];
}

const PutPost: React.FC = () => {
  const { id }: { id: string } = useParams();
  const url = `/api/posts/${id}`;
  const endPoint = `/api/admin/posts/[id]`;
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<PostForm>({
    defaultValues: {
      title: "",
      content: "",
      thumbnailUrl: "",
      categories: [],
    },
  });

  // 記事詳細APIのレスポンス型を定義しておく（src/app/admin/posts/[id]/_types/index.tsに移動）
  type PostResponse = {
    status: number;
    post: Post & {
      postCategories: (PostCategory & { category: Category })[];
    };
  };

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const resp = await fetch(url, { method: "GET" });
      const { post }: PostResponse = await resp.json();

      // 取得したデータをresetでセット。
      reset({
        title: post.title,
        content: post.content,
        thumbnailUrl: post.thumbnailUrl,
        // APIレスポンスのpostCategories⇨formのcategoriesに型変換
        categories: post.postCategories.map((postCategory) => {
          return {
            id: postCategory.category.id,
            name: postCategory.category.name,
          };
        }),
      });
      setLoading(false);
    };

    fetcher();
  }, [reset, url]);

  // カテゴリー一覧APIのレスポンス型を定義しておく（src/app/admin/posts/[id]/_types/index.tsに移動）
  type CategoryResponse = {
    status: number;
    data: Category[];
  };

  // カテゴリー一覧を取得は別処理としておこなう
  useEffect(() => {
    const fetcher = async () => {
      const resp = await fetch("/api/admin/categories", { method: "GET" });
      const { data }: CategoryResponse = await resp.json();
      setCategories(data);
    };

    fetcher();
  }, []);

  if (isLoading) return <div>読み込み中...</div>;

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("削除してもよろしいですか？");
    if (!confirmDelete) return;
    setIsDeleting(true);
    const prams = {
      method: "DELETE",
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

  const onSubmit: SubmitHandler<PostForm> = async (data) => {
    const categoryIds = data.categories.map((item) => item.id);
    const prams = {
      method: "PUT",
      body: JSON.stringify({
        id: parseInt(id),
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        categoryIds: categoryIds,
      }),
    };
    try {
      const resp = await fetch("/api/admin/posts/[id]", prams);
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

  // カテゴリー選択時の処理
  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    // 選択されたカテゴリーが既に選択されているかどうかを確認
    const isSelected = watch("categories")
      .map((c) => c.id)
      .includes(id);

    // 選択されている場合
    if (isSelected) {
      // 選択されたカテゴリーを除外した新しいカテゴリーリストを作成
      const newCategories = watch("categories").filter((c) => c.id !== id);
      // 新しいカテゴリーリストをセット
      setValue("categories", newCategories);
    } else {
      // 選択されていない場合
      // 選択されたカテゴリーを取得
      const category = categories.find((c) => c.id === id);
      // 選択されたカテゴリーを追加した新しいカテゴリーリストをセット
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
            {categories.map((item) => {
              const isSelected = watch("categories")
                .map((c) => c.id)
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
