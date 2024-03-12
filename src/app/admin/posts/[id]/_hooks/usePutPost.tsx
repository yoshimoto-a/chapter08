"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Category } from "@/app/_types/Post";

export const usePutPost = (url:string,id:Number) => {
  
  interface Inputs  {
    title: string,
    contents: string,
    thumbnailUrl: string,
    categories: Category[]
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>({});

  const throwError = () => {
    throw new Error("error");
  };

  const onSubmit: SubmitHandler<Inputs> = async data => {
    interface category {
      id: number,
      name: string
    }
    let aryCategory:category[] = [];
    let jsonData;
    //カテゴリーのidを配列に入れる
    data.categories.map(item => {
      jsonData = JSON.parse(item.toString());
      aryCategory.push({id:jsonData.id, name:jsonData.name});
    })
    
    const prams = {
      method:"PUT",
      body: JSON.stringify({
        id:id,
        title: data.title,
        content: data.contents,
        thumbnailUrl: data.thumbnailUrl,
        postCategories: aryCategory
      })
    };
    try {
      const resp = await fetch(url, prams);
      const contents = await resp.json();
      if(contents.status === 200){
        window.alert("登録に成功しました")
        window.location.href = '/admin/posts';
        }else{
          throwError();}
    } catch (e) {
      if(e instanceof Error){
        window.alert("登録に失敗しました");
      }
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    formState: {isSubmitting },
  };
};
