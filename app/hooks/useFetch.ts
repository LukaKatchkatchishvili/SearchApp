"use client";
import { useEffect, useState } from "react";
import { FetchConfig, Data } from "../types/types";

export function useFetch(config: FetchConfig) {
  const { searchTerm, page, clientId } = config;
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const cacheKey = searchTerm
          ? `search-${searchTerm}-page-${page}`
          : `popular-page-${page}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          const parsedData: Data[] = JSON.parse(cachedData);
          if (page === 1) {
            setData(parsedData);
          } else {
            setData((prevData) => [...prevData, ...parsedData]);
          }
          setLoading(false);
        } else {
          let apiUrl = `https://api.unsplash.com/photos?page=${page}&per_page=20&order_by=popular&client_id=${clientId}`;

          if (searchTerm) {
            apiUrl = `https://api.unsplash.com/search/photos?page=${page}&per_page=20&query=${searchTerm}&client_id=${clientId}`;
          }

          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const jsonData = await response.json();
          let newData: Data[] = [];

          if (jsonData.results) {
            newData = jsonData.results.map((item: any) => ({
              id: item.id,
              alt_description: item.alt_description,
              urls: {
                small: item.urls.small,
                full: item.urls.full,
              },
              likes: item.likes,
              tags: item.tags?.map((tag: any) => ({ title: tag.title })),
            }));
          } else {
            newData = jsonData.map((item: any) => ({
              id: item.id,
              alt_description: item.alt_description,
              urls: {
                small: item.urls.small,
                full: item.urls.full,
              },
              likes: item.likes,
              tags: item.tags?.map((tag: any) => ({ title: tag.title })),
            }));
          }

          if (page === 1) {
            setData(newData);
          } else {
            setData((prevData) => [...prevData, ...newData]);
          }

          setLoading(false);

          localStorage.setItem(cacheKey, JSON.stringify(newData));
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch");
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, page, clientId]);

  return { data, loading, error };
}
