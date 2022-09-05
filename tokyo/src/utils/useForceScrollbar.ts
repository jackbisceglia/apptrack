import { useLocation, useParams } from "react-router-dom";

import { useEffect } from "react";

const useForceScrollbar = (pages: string[]) => {
  const { pathname } = useLocation();
  useEffect(() => {
    const overflowYStyle = pages.includes(pathname) ? "scroll" : "auto";

    document.querySelector("body")!.style.overflowY = overflowYStyle;
  }, [pathname]);
};

export default useForceScrollbar;
