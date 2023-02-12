export const tickUpdate = (cb): ((e?: any) => void) => {
  let ticking = false;

  const update = (e?: any) => {
    cb(e);
    ticking = false;
  };

  const requestTick = (e?: any) => {
    if (!ticking) {
      requestAnimationFrame(() => update(e));
      ticking = true;
    }
  };

  return requestTick;
};

export const random = (to: number, from = 0): number => {
  return Math.random() * (to - from) + from;
};

export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

export const mapRange = (
  value: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

export const formToObject = (form: HTMLFormElement): Record<string, any> => {
  const fd = new FormData(form);
  return [...fd.entries()].reduce(
    (prev, curr) => ({
      ...prev,
      [curr[0]]: curr[1],
    }),
    {},
  );
};

export const listenCb = (
  el: Window | Element | Document,
  evtType: string,
  cb: (...args: any) => void,
  options?: any,
) => {
  el.addEventListener(evtType, cb, options);

  return () => {
    el.removeEventListener(evtType, cb);
  };
};

export const videoPlaying = (el: HTMLVideoElement): Promise<boolean> => {
  return new Promise((resolve) => {
    const unlisten = listenCb(el, "playing", () => {
      unlisten();
      resolve(true);
    });
  });
};

type VideoOptions = {
  loop?: boolean;
  muted?: boolean;
  autoplay?: boolean;
  hidden?: boolean;
};

export const createVideo = (
  src: string,
  parentEl: HTMLElement,
  options: VideoOptions = {},
) => {
  const videoEl = document.createElement("video");
  videoEl.src = src;
  videoEl.autoplay = options.autoplay || true;
  videoEl.muted = options.muted || true;
  videoEl.loop = options.loop || true;
  videoEl.classList.add("media-container-item");

  if (options.hidden) {
    videoEl.classList.add("media-container-item-hidden");
  }

  parentEl.classList.add("media-container");
  parentEl.appendChild(videoEl);

  return videoEl;
};
