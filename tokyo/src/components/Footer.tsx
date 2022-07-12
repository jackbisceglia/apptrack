import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 py-20">
      <div className="mx-auto max-w-screen-sm font-bold">
        <div className="mb-8 flex flex-col gap-8 sm:flex-row">
          <div className="grow basis-0">
            <h2 className="mb-3 border-b-2 border-b-stone-800 pb-1 text-red-500">
              MISC
            </h2>
            <ul>
              {/* <li>
                <Link
                  className="block rounded-md p-1 pl-0 transition-[padding] duration-150 ease-out hover:bg-red-500 hover:pl-2 hover:text-stone-50"
                  to="/unsubscribe"
                >
                  Unsubscribe
                </Link>
              </li> */}
              <li>
                <a
                  className="block rounded-md p-1 pl-0 transition-[padding] duration-150 ease-out hover:bg-red-500 hover:pl-2 hover:text-stone-50"
                  href="https://github.com/jackbisceglia/internship-tracker"
                  target="_blank"
                >
                  Contribute
                </a>
              </li>
              <li>
                <a
                  className="block rounded-md p-1 pl-0 transition-[padding] duration-150 ease-out hover:bg-red-500 hover:pl-2 hover:text-stone-50"
                  href="https://github.com/pittcsc/Summer2023-Internships"
                  target="_blank"
                >
                  Internship Repo
                </a>
              </li>
              <li>
                <a
                  className="block rounded-md p-1 pl-0 transition-[padding] duration-150 ease-out hover:bg-red-500 hover:pl-2 hover:text-stone-50"
                  href="https://github.com/coderQuad/New-Grad-Positions-2023"
                  target="_blank"
                >
                  New Grad Repo
                </a>
              </li>
            </ul>
          </div>
          <div className="grow basis-0">
            <h2 className="mb-3 border-b-2 border-b-stone-800 pb-1 text-red-500">
              MADE BY
            </h2>
            <ul>
              <li>
                <a
                  className="block rounded-md p-1 pl-0 transition-[padding] duration-150 ease-out hover:bg-red-500 hover:pl-2 hover:text-stone-50"
                  href="https://github.com/jackbisceglia"
                  target="_blank"
                >
                  Jack Bisceglia
                </a>
              </li>
              <li>
                <a
                  className="block rounded-md p-1 pl-0 transition-[padding] duration-150 ease-out hover:bg-red-500 hover:pl-2 hover:text-stone-50"
                  href="https://github.com/nabilbaugher"
                  target="_blank"
                >
                  Nabil Baugher
                </a>
              </li>
              <li>
                <a
                  className="block rounded-md p-1 pl-0 transition-[padding] duration-150 ease-out hover:bg-red-500 hover:pl-2 hover:text-stone-50"
                  href="https://github.com/joepetrillo"
                  target="_blank"
                >
                  Joe Petrillo
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center font-normal text-stone-500">{`${year} - AppTrack`}</p>
      </div>
    </footer>
  );
}
