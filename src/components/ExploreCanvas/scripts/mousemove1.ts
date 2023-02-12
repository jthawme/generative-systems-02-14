import { clamp, listenCb, mapRange } from "../../../utils/utils";
import { getAudio } from "../../Equalizer/audio";
import { DrawFunc } from "./common";

export const draw: DrawFunc = (ctx, width, height) => {
  let mouseX = 0;
  let mouseY = 0;

  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  let drawing = true;

  let frameId = 0;

  const redraw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillRect(mouseX * width, mouseY * height, 5, 5);
    if (drawing) {
      frameId = requestAnimationFrame(redraw);
    }
  };

  const unlisten = listenCb(document, "mousemove", (e) => {
    mouseX = clamp(mapRange(e.clientX, 0, wWidth, 0, 1), 0, 1);
    mouseY = clamp(mapRange(e.clientY, 0, wHeight, 0, 1), 0, 1);
  });

  redraw();

  return Promise.resolve(() => {
    drawing = false;
    unlisten();
    cancelAnimationFrame(frameId);
  });
};
