import { useEffect, useState } from "react";

type fadeFactorOptions = 1 | 2 | 3 | 4 | 5;

const useFadeIn = (position: number, fadeFactor: fadeFactorOptions) => {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setOpacity((opacity) => 100);
    }, fadeFactor * 10 * (position % 10));
  }, []);
  return opacity;
};

export default useFadeIn;
