/*管理者カテゴリー一覧ページ */
"use client";

import  Link  from "next/link";
import { useApi } from "@/app/_hooks/useApi";
import type { Category as CategoryType } from "@prisma/client";

const CategoryList: React.FC = () => {
  const { data, isLoading } = useApi("/api/admin/categories",{ method: "GET" });

  if (isLoading) return <div>読み込み中...</div>;
  if (!data || data.data.length === 0) return <div>カテゴリーがありません</div>;
  const categories: CategoryType[] = data.data;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 childrentext-3xl font-bold text-gray-900 bg-gray-100 py-4 px-6 mb-6>カテゴリー一覧</h1>
        <Link
          href={"/admin/category/new"}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          新規作成
        </Link> 
      </div>
      <div>
        <ul>
          {categories.map((item) => (
            <li className="flex flex-col list-none m-0 p-0" key={item.id}>
              <Link
                href={`/admin/category/${item.id}`}
                className="text-gray-700 no-underline">
                <div className="border-gray-300 flex flex-row mb-8 p-4 border-b">
                  <p className="text-xl mb-4 mt-2">{item.name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
export default CategoryList;
