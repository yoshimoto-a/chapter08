"use client";

import { useParams } from 'next/navigation';
import { Categories } from "@/app/_components/Categories";
import dayjs from "dayjs";
import Image from "next/image";
import { MicroCmsPost } from '@/app/_types/MicroCmsPost';
import { useApi } from '@/app/_hooks/useApi';

const Post = () => {
  const { id } = useParams();
  const { data, isLoading } = useApi(`https://reoh07vbzw.microcms.io/api/v1/posts/${id}`);

  if (isLoading) return <div>読み込み中...</div>;
  if (!data) return <div>記事がありません</div>;
  const post:  MicroCmsPost = data;

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