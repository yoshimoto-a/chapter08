"use client";
import { useState } from "react";

export const useDeletePost = (url:string,id:Number) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = async () => {
    try {
      setIsDeleting(true);
      const prams = { method: "DELETE", body:JSON.stringify(id) };
      const data  = await fetch(url, prams);
      const { status } = await data.json();
      setIsDeleting(false);
      if(status === 200){
        window.alert("削除に成功しました");
        window.location.href = '/admin/posts';
      }else{
        window.alert("削除に成功しました");
      }
    }catch(e) {
      if(e instanceof Error){
        window.alert("例外発生");
      }
    }
  };

  return {isDeleting, deletePost};
};
