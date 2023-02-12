import { useEffect, useState } from "react";

export interface BrowserList {
  chrome?: boolean;
  explorer?: boolean;
  firefox?: boolean;
  safari?: boolean;
  opera?: boolean;
}

const useBrowserDetect = (): BrowserList => {
  const [browsers, setBrowsers] = useState<BrowserList>({});

  useEffect(() => {
    const obj = {
      chrome: navigator.userAgent.indexOf("Chrome") > -1,
      explorer: navigator.userAgent.indexOf("MSIE") > -1,
      firefox: navigator.userAgent.indexOf("Firefox") > -1,
      safari: navigator.userAgent.indexOf("Safari") > -1,
      opera: navigator.userAgent.toLowerCase().indexOf("op") > -1,
    };

    if (obj.chrome && obj.safari) {
      obj.safari = false;
    }
    if (obj.chrome && obj.opera) {
      obj.chrome = false;
    }

    setBrowsers(obj);
  }, []);

  return browsers;
};

export { useBrowserDetect };
