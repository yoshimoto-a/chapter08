"use client";

/*言語のカテゴリー*/
import "../app/globals.css";
import React from "react";
import type { Post } from "@/typees/Post";

interface CategoriesProps {
  categories: Post["categories"];
}

export const Categories:React.FC<CategoriesProps> = ({ categories }) => (
  <div className="flex flex-wrap">
    {categories.map((category, index) => (
      <div
        className="border border-solid border-blue-500 rounded text-blue-500 text-xs px-2 py-1 mr-2"
        key={index}
      >
        {category}
      </div>
    ))}
  </div>
);
