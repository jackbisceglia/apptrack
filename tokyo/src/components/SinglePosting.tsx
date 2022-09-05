import { PostingType } from "../routes/Postings";
import useFadeIn from "../utils/useFadeIn";

type PostPropTypes = Partial<PostingType> & { listPosition: number };

function SinglePosting({
  company,
  location,
  createdAt,
  listPosition,
  isIntern,
}: PostPropTypes) {
  let opacity = useFadeIn(listPosition, 1);

  const postingDate = new Date(createdAt!);

  return (
    <div
      className={`flex w-auto justify-between border-b-2 border-gray-800 py-2 opacity-${opacity} transition-opacity duration-500 ease-in`}
    >
      <div>
        <h1 className="font-bold">{company}</h1>
        <h1>{location}</h1>
      </div>
      <div>
        <h1 className="text-red-500">{postingDate.toDateString()}</h1>
        <h1 className="">{isIntern ? "Internship" : "New Grad"}</h1>
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
