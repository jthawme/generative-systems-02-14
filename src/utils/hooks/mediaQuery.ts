import { useEffect, useState } from "react";

export const useMediaQuery = (mqs: string, initial = false): boolean => {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    const mq = window.matchMedia(mqs);
    const cb = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    setMatches(mq.matches);

    mq.addListener(cb);

    return () => mq.removeListener(cb);
  }, [mqs]);

  return matches;
};
