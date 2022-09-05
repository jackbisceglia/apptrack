import { PostingsResponseType, listSourceOptions } from "../routes/Postings";
import React, { Dispatch, useEffect } from "react";

import { API } from "./constants";
import { useInfiniteQuery } from "@tanstack/react-query";

type queryFiltersType = listSourceOptions[];

const useInfiniteLoad = (filters: queryFiltersType) => {
  const fetchData = async ({
    pageParam = 1,
  }): Promise<PostingsResponseType> => {
    return fetch(`${API}/postings/${filters[0]}?page=${pageParam}`).then(
      (res) => res.json()
    );
  };

  const queryProps = useInfiniteQuery(["postings", ...filters], fetchData, {
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasNextPage) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  useEffect(() => {
    queryProps.refetch();
  }, [...filters]);

  return queryProps;
};

export default useInfiniteLoad;
