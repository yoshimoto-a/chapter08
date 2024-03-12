"use client";

/*言語のカテゴリー*/
import "../globals.css";
import React from "react";
import { useApi } from "../_hooks/useApi";
import type { PostCategory } from "../_types/Post";
import type { Category as CategoryType } from "../_types/Post";

interface Props {
  categories: PostCategory[];
}

export const Categories:React.FC<Props> = ( {categories} ) => {
  const { data, isLoading } = useApi("/api/admin/categories",{ method: "GET" });
  if (isLoading) return <div>読み込み中...</div>;
  const aryCategories: CategoryType[] = data.data;

  return (
    <div className="flex flex-wrap">
      {categories.map((category, index) => (
        <div
          className="border border-solid border-blue-500 rounded text-blue-500 text-xs px-2 py-1 mr-2"
          key={index}
        >
          {aryCategories.find(getCategory => category.categoryId === getCategory.id)?.name}
        </div>
      ))}
    </div>
    )
}