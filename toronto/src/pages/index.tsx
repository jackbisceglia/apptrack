import type { GetServerSideProps, NextPage } from "next";

import Head from "next/head";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import useProtectedRoute from "../utils/useProtectedRoute";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["example.getAll"], {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <h1>loading</h1>;
  }

  const { name, image } = data![0]!;
  const dashString = `${name}'s AppTrack Dashboard`;

  return (
    <>
      <Head>
        <title>AppTrack - Dashboard</title>
        <meta name="description" content={dashString} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <div className="flex justify-center items-center">
          <Image
            src={data![0]?.image!}
            height={84}
            width={84}
            alt="Jack's picture"
            className="px-3 rounded-full"
          />
          <h1 className="px-3 text-xl font-bold">
            Hey{" "}
            <span className="text-red-500 font-black">
              {name?.split(" ")[0]}
            </span>
            , welcome back!
          </h1>
        </div>
      </>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = (context) =>
  useProtectedRoute(context);

export default Home;
