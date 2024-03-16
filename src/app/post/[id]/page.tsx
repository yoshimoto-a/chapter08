/* 記事詳細ページ */
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import type { Post } from "@/app/_types/Post";
import { Categories } from "@/app/_components/Categories";
import type { Category } from "@prisma/client";

const PostItem: React.FC = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState<Post>();
  const [category, setCategory] = useState<Category[]>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const resp = await fetch(`/api/posts/${id}`, { method: "GET" });
      const { post } = await resp.json();
      setPostData(post);
      const categoryResp = await fetch(`/api/admin/categories`, {
        method: "GET",
      });
      const { data } = await categoryResp.json();
      setCategory(data);
      setLoading(false);
    };
    fetcher();
  }, []);

  if (isLoading) return <div>読み込み中...</div>;
  if (!postData) return <div>記事がありません</div>;

  let categories: Category[];
  let propsCategory: any[]; //仮置き場的変数だからanyにしました
  if (category) {
    propsCategory = postData.postCategories
      .map(item => item.category.id)
      .map(id => category.find(item => item.id === id));
  } else {
    propsCategory = [];
  }

  if (!propsCategory) propsCategory = [];
  categories = propsCategory;

  return (
    <div className="mx-auto max-w-800px flex justify-center items-center">
      <div className="flex flex-col p-4">
        <Image
          src={"https://placehold.jp/800x400.png"}
          alt={""}
          width={"800"}
          height={"400"}
          className={"h-auto max-w-full"}
        />
        <div className="p-4">
          <div className="flex justify-between">
            <div className="text-gray-600 text-xs">
              {dayjs(postData.createdAt).format("YYYY/MM/DD")}
            </div>
            <Categories categories={categories}></Categories>
          </div>
          <div className="text-lg mb-4 mt-2">{postData.title}</div>
          <div
            className="text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: postData.content }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default PostItem;
