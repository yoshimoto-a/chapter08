/*記事一覧ページ*/
"use client";

import "./globals.css";
import { Categories } from "@/app/_components/Categories";
import dayjs from "dayjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Post } from "./_types/Post";

const Post: React.FC = () => {
  const [data, setData] = useState<Post[]>();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const fetcher = async () => {
      const resp = await fetch("/api/posts/", { method: "GET" });
      const { posts } = await resp.json();
      setData(posts);
      setLoading(false);
    };
    fetcher();
  }, []);

  if (isLoading) return <div>読み込み中...</div>;
  if (!data || data.length === 0) return <div>記事がありません</div>;

  return (
    <div className="mx-auto max-w-screen-lg px-4 my-10">
      <ul>
        {data.map(item => (
          <li className="flex flex-col list-none m-0 p-0" key={item.id}>
            <Link
              href={`/post/${item.id}`}
              className="text-gray-700 no-underline"
            >
              <div className="border border-gray-300 flex flex-row mb-8 p-4">
                <div>
                  <div className="flex justify-between">
                    <div className="text-gray-500 text-sm">
                      {dayjs(item.createdAt).format("YYYY/MM/DD")}
                    </div>
                    <div className="flex flex-wrap">
                      <Categories
                        categories={item.postCategories.map(
                          category => category.category
                        )}
                      ></Categories>
                    </div>
                  </div>
                  <p className="text-xl mb-4 mt-2">{item.title}</p>
                  <div
                    className="text-base leading-relaxed line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Post;
