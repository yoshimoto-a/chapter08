/*管理者カテゴリー編集ページ */
"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const CategoryPut: React.FC = () => {
  const { id } = useParams();
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const resp = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 👈 Header に token を付与
        },
      });
      const { post } = await resp.json();
      setText(post.name);
      setIsLoading(false);
    };
    fetcher();
  }, [token]);

  if (isLoading) return <div>読み込み中...</div>;

  const PutCategory = async () => {
    if (!token) return;
    try {
      const prams = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          id: Number(id),
          name: text,
        }),
      };
      const resp = await fetch("/api/admin/categories/[id]", prams);
      if (resp.status === 200) {
        window.alert("更新に成功しました");
        router.push("/admin/category");
      } else {
        window.alert("更新に失敗しました");
      }
    } catch (e) {
      if (e instanceof Error) {
        window.alert("更新に失敗しました");
      }
    }
  };

  const deleteCategory = async () => {
    if (!token) return;

    const confirmDelete = window.confirm("削除してもよろしいですか？");
    if (!confirmDelete) return;
    try {
      const prams = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 👈 Header に token を付与
        },
        body: JSON.stringify({
          id: Number(id),
        }),
      };
      const resp = await fetch("/api/admin/categories/[id]", prams);
      if (resp.status === 200) {
        window.alert("削除に成功しました");
        router.push("/admin/category");
      } else {
        window.alert("削除に失敗しました");
      }
    } catch (e) {
      if (e instanceof Error) {
        window.alert("削除に失敗しました");
      }
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">記事編集</h1>
      <div>
        <label htmlFor="title" className="w-[240px]">
          カテゴリー
        </label>
        <div className="w-full">
          <input
            type="text"
            id="category"
            className="border border-gray-300 rounded-lg p-4 w-full mb-4"
            value={text}
            onChange={e => setText(e.target.value)}
          ></input>
        </div>
        <div className="flex">
          <button
            type="button"
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4"
            onClick={PutCategory}
          >
            登録
          </button>
          <button
            type="button"
            className="bg-red-800 text-white font-bold py-2 px-4 rounded-lg"
            onClick={deleteCategory}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPut;
