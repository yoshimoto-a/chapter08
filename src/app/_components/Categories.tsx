"use client";

/*言語のカテゴリー*/
import "../globals.css";
import React from "react";
import type { MicroCmsPost } from "../_types/MicroCmsPost";

interface CategoriesProps {
  categories: MicroCmsPost["categories"];
}

export const Categories:React.FC<CategoriesProps> = ({ categories }) => (
  <div className="flex flex-wrap">
    {categories.map((category, index) => (
      <div
        className="border border-solid border-blue-500 rounded text-blue-500 text-xs px-2 py-1 mr-2"
        key={index}
      >
        {category.name}
      </div>
    ))}
  </div>
);
