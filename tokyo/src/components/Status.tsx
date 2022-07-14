export default function Status({
  message,
  state,
}: {
  message: string;
  state: string;
}) {
  const sharedStyles = "mt-4 h-7 text-lg font-bold";

  switch (state) {
    case "success":
      return <p className={`${sharedStyles} text-green-700 `}>{message}</p>;
    case "loading":
      return <p className={`${sharedStyles} text-stone-800`}>{message}</p>;
    case "error":
      return <p className={`${sharedStyles} text-red-500 `}>{message}</p>;
  }

  return <p className={`${sharedStyles}`}></p>;
}
