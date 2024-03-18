/*管理者カテゴリー新規作成ページ */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const CategoryPost: React.FC = () => {
  const [text, setText] = useState<string>("");
  const router = useRouter();
  const { token } = useSupabaseSession();

  const clickSubmit = async () => {
    const prams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // 👈 Header に token を付与
      },
      body: JSON.stringify({
        name: text,
      }),
    };
    try {
      const resp = await fetch("/api/admin/categories/", prams);
      if (resp.status === 200) {
        window.alert("登録に成功しました");
        router.push("/admin/category");
      } else {
        window.alert("登録に失敗しました");
      }
    } catch (e) {
      if (e instanceof Error) {
        window.alert("登録に失敗しました");
      }
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-10">新規追加</h1>
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
            onClick={clickSubmit}
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
};
export default CategoryPost;
