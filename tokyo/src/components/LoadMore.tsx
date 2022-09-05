import Spinner from "./Spinner";

type LoadMorePropTypes = {
  isFetching: boolean;
  fetchMore: () => {};
  hasNextPage: boolean | undefined;
};

export default function LoadMore({
  isFetching,
  fetchMore,
  hasNextPage,
}: LoadMorePropTypes) {
  const buttonIsDisabled = isFetching || !hasNextPage;

  const activeButtonStyle = `my-6 flex w-full items-center justify-center rounded-md  p-2 text-lg text-stone-50 bg-red-500 hover:bg-red-600 `;
  const disableButtonStyle = `my-6 flex w-full items-center justify-center rounded-md  p-2 text-lg text-stone-50  bg-gray-400 text-gray-200`;

  let buttonMessage = "";

  if (isFetching) {
    buttonMessage = "Loading...";
  } else if (!hasNextPage) {
    buttonMessage = "No more postings";
  } else {
    buttonMessage = "Load more";
  }

  if (hasNextPage) {
    return (
      <button
        className={activeButtonStyle}
        onClick={fetchMore}
        disabled={buttonIsDisabled}
      >
        {isFetching && <Spinner />}
        {buttonMessage}
      </button>
    );
  } else {
    return <div className={disableButtonStyle}>No more postings</div>;
  }
}
