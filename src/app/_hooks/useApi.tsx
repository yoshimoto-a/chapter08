"use client";
import { JsonObject } from "@prisma/client/runtime/library";
import { useState, useEffect } from "react";

export const useApi = (url: string, body: JsonObject) => {
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    try {
      const fetcher = async () => {
        setLoading(true);
        const resp = body 
          ? await fetch(url, body)
          : await fetch(url);
        const data = await resp.json();
        setData(data);
        setLoading(false);
      }
      fetcher();
    }catch(e) {
      if( e instanceof Error) {
        console.log(e.message);      }
    }
  }, [url]);
  return {data, isLoading}
}