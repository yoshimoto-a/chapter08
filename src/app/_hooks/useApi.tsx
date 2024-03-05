"use client";
import { useState, useEffect } from "react";

export const useApi = (url:string) => {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const resp = await fetch(url,
        {
          headers: {
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
          }
        }
      );
      const data = await resp.json();
      setData(data);
      setLoading(false);
      }
      fetcher();
    }, [url]);
return { data,isLoading}
}