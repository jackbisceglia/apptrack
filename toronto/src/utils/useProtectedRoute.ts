import { GetServerSidePropsContext, PreviewData } from "next";

import { ParsedUrlQuery } from "querystring";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

const useProtectedRoute = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // will be passed to the page component as props
  };
};

export default useProtectedRoute;
