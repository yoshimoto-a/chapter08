"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { Categories } from "@/app/_components/Categories";
import type { MicroCmsPost } from "@/app/_types/MicroCmsPost"
import dayjs from "dayjs";
import Image from "next/image";

const Post = () => {
  const { id } = useParams();
  const [post , setPost] = useState<MicroCmsPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      const resp = await fetch(
        `https://reoh07vbzw.microcms.io/api/v1/posts/${id}`,
        {
          headers: {
            'X-MICROCMS-API-KEY': 'hIKXpa6yuQEnAGIDI12BL0cs0SPUBEeMTiPe'
          }
        }
      );
      const data = await resp.json();
      setPost(data);
      setIsLoading(false);
    };
    fetcher();
  }, [id]);

  if (isLoading) return <div>読み込み中...</div>;
  if (!post) return <div>記事がありません</div>;
  
  return (
    <>
      <div className="mx-auto max-w-800px">
        <div className="flex flex-col p-4">
          <Image
            src={post.thumbnail.url}
            alt={""}
            width={"800"}
            height={"400"}
            className={"h-auto max-w-full"}
          />
          <div className="p-4">
            <div className="flex justify-between">
              <div className="text-gray-600 text-xs">
                {dayjs(post.createdAt).format("YYYY/MM/DD")}
              </div>
              <Categories categories={post.categories}></Categories>
            </div>
            <div className="text-lg mb-4 mt-2">{post.title}</div>
            <div
              className="text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;