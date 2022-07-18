export default function About() {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-sm">
        <h2 className="mb-4 text-4xl font-bold">About 📚</h2>
        <p className="mb-4 text-lg">
          AppTrack ensures you'll never miss out on the most prevalent
          internship and new grad job postings. After signing up, you will
          receive daily emails containing the latest updates we have compiled
          from popular open-source GitHub repositories. Currently, AppTrack uses
          the PittCSC{" "}
          <a
            className="text-red-500 underline"
            href="https://github.com/pittcsc/Summer2023-Internships"
            target="_blank"
          >
            internship repo
          </a>
          , maintained by the Pitt Computer Science Club, and the CoderQuad{" "}
          <a
            className="text-red-500 underline"
            href="https://github.com/coderQuad/New-Grad-Positions-2023"
            target="_blank"
          >
            new grad repo
          </a>
          , supported by the community. We will never spam you, and you may
          unsubscribe anytime; just click the link at the bottom of one of our
          emails.
        </p>
        <p className="text-lg">
          This project was built using a modern tech stack, including
          Typescript, React, TailwindCSS, Golang, and AWS Lambda Functions. If
          you are interested in learning more, check out{" "}
          <a
            className="text-red-500 underline"
            href="https://github.com/jackbisceglia/internship-tracker"
            target="_blank"
          >
            our repository
          </a>
          , and feel free to contribute!
        </p>
      </div>
    </div>
  );
}
