/*管理者記事一覧ページ */
"use client";
import  Link  from "next/link";
import { useApi } from "@/app/_hooks/useApi";
import dayjs from "dayjs";
import type { Post } from "@prisma/client";

const AdminPost: React.FC = () => {
  const url = "/api/admin/posts";
  const { data , isLoading } = useApi(url,{ method: "GET" });

  if (isLoading) return <div>読み込み中...</div>;
  if (!data.posts || data.posts.length === 0) return <div>記事がありません</div>;
  const posts: Post[] = data.posts;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 childrentext-3xl font-bold text-gray-900 bg-gray-100 py-4 px-6 mb-6>記事一覧</h1>
        <Link href={"/admin/posts/new"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">記事作成</Link> 
      </div>
      <div>
        <ul>
          {posts.map((item) => (
            <li className="flex flex-col list-none m-0 p-0" key={item.id}>
              <Link href={`/admin/posts/${item.id}`} className="text-gray-700 no-underline">
                <div className="border-gray-300 flex flex-row mb-8 p-4 border-b">
                  <div>
                    <p className="text-xl mb-4 mt-2">{item.title}</p>
                    <div className="text-gray-500 text-sm">
                      {dayjs(item.createdAt).format("YYYY/MM/DD")}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
export default AdminPost;
