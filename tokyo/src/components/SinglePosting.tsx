import { PostingType } from "../routes/Postings";
import useFadeIn from "../utils/useFadeIn";

type PostPropTypes = Partial<PostingType> & { listPosition: number };

function SinglePosting({
  company,
  location,
  createdAt,
  listPosition,
  isIntern,
  url,
}: PostPropTypes) {
  let opacity = useFadeIn(listPosition, 1);

  const getPositionType = () => (isIntern ? "Internship" : "New Grad");

  return (
    <div
      className={`mb-4 flex items-center justify-between gap-4 border-b-2 border-stone-200 py-6 px-2 opacity-${opacity} transition-opacity duration-500 ease-in hover:rounded-md hover:bg-stone-200`}
    >
      <div>
        <span className="mr-2 inline-block text-lg font-bold">{company}</span>
        <span
          className={`inline-block rounded-md ${
            isIntern ? "bg-blue-400" : "bg-orange-400"
          } px-2 text-sm text-stone-50`}
        >
          {getPositionType()}
        </span>
        {/* <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">{company}</h1>
          <span
            className={`block rounded-md ${
              isIntern ? "bg-blue-400" : "bg-orange-400"
            } px-2 text-sm text-stone-50`}
          >
            {isIntern ? "Internship" : "New Grad"}
          </span>
        </div> */}
        <p className="text-stone-500">{location}</p>
      </div>
      <div className="shrink-0 rounded-md text-lg">
        <a className="p-2 hover:underline" href={url}>
          Apply
        </a>
      </div>
    </div>
  );
}

export default SinglePosting;

//  JOE'S VERSION OF POST. COMMENTED OUT FOR STYLING REFERENCE
// export default function Post() {
//   return (
//     <div className="mb-4 flex items-center justify-between gap-2 border-b-2 border-b-stone-800 p-4 transition-[padding] duration-150 ease-out last:mb-0 hover:pl-8">
//       <div>
//         <p className="text-xl font-bold line-clamp-2">Company Name Here</p>
//         <p className="line-clamp-2">Location Here</p>
//         <span className="mr-2 mt-2 inline-block rounded-md bg-blue-500 py-0.5 px-2 text-stone-50 last:mr-0">
//           New Grad
//         </span>
//         <span className="mr-2 mt-2 inline-block rounded-md bg-red-500 py-0.5 px-2 text-stone-50 last:mr-0">
//           Internship
//         </span>
//       </div>
//       <a
//         className="shrink-0 text-lg underline"
//         href="https://jobs.apple.com/en-us/details/200389054/software-engineering-internship?team=SDNT"
//         target="_blank"
//       >
//         Apply
//       </a>
//     </div>
//   );
// }
