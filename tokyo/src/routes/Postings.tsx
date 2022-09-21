import LoadMore from "../components/LoadMore";
import SinglePosting from "../components/SinglePosting";
import useInfiniteLoad from "../utils/useInfiniteLoad";
import { useState } from "react";

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

const LinkedInIntegration = ({
  listSource,
}: {
  listSource: listSourceOptions;
}) => {
  const jobType = listSource === listSourceOptions.INTERN ? "intern" : "grad";

  const linkedInQueryLink = `https://www.linkedin.com/jobs/search/?keywords=software%20${jobType}`;

  return (
    <p className="text-center">
      Want to see more like this? Try{" "}
      <a
        target="_blank"
        className="font-bold text-blue-600"
        href={linkedInQueryLink}
      >
        LinkedIn
      </a>
    </p>
  );
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
            <label>Show Postings For: </label>
            <select
              value={listSource}
              onChange={handleListSourceChange}
              id="listFilter"
              name="listFilter"
              className="mb-4 rounded-md bg-stone-200 p-2"
            >
              <option value={listSourceOptions.INTERN}>Internship</option>
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
                url={posting.url}
              />
            ))}
            <LoadMore
              isFetching={isFetching}
              fetchMore={fetchNextPage}
              hasNextPage={hasNextPage}
            />
            <LinkedInIntegration listSource={listSource} />
          </>
        )}
      </div>
    </div>
  );
}

export default Postings;
