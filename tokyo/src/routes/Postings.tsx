import { useEffect, useState } from "react";

import { API } from "../utils/constants";
import LoadMore from "../components/LoadMore";
import SinglePosting from "../components/SinglePosting";
import useInfiniteLoad from "../utils/useInfiniteLoad";
import { useInfiniteQuery } from "@tanstack/react-query";

export enum listSourceOptions {
  INTERN = "intern",
  NEWGRAD = "newgrad",
  BOTH = "both",
}

export type PostingType = {
  company: string;
  location: string;
  notes: string;
  isIntern: boolean;
  url: string;
  id: string;
  createdAt: string;
};

export type PostingsResponseType = {
  postings: PostingType[];
  hasNextPage: boolean;
};

function Postings() {
  const [listSource, setListSource] = useState(listSourceOptions.INTERN);

  const { isLoading, isFetching, isError, fetchNextPage, data, hasNextPage } =
    useInfiniteLoad([listSource]);

  const handleListSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // resets from cache, avoid current global page issue, but resets every time
    setListSource(e.target.value as listSourceOptions);
  };

  const flattenPostings = () =>
    data!.pages.map(({ postings }) => postings).flat();

  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-sm">
        <h2 className="mb-4 text-4xl font-bold">Postings 📌</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <label>Posting Choice: </label>
            <select
              value={listSource}
              onChange={handleListSourceChange}
              id="listFilter"
              name="listFilter"
            >
              <option value={listSourceOptions.INTERN}>Intern</option>
              <option value={listSourceOptions.NEWGRAD}>New Grad</option>
            </select>
            {flattenPostings().map((posting: PostingType, idx: number) => (
              <SinglePosting
                key={idx}
                listPosition={idx}
                company={posting.company}
                createdAt={posting.createdAt}
                location={posting.location}
                isIntern={posting.isIntern}
              />
            ))}
            <LoadMore
              isFetching={isFetching}
              fetchMore={fetchNextPage}
              hasNextPage={hasNextPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Postings;
