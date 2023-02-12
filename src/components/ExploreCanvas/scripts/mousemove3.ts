import { clamp, listenCb, mapRange } from "../../../utils/utils";
import { getAudio } from "../../Equalizer/audio";
import { DrawFunc } from "./common";

const MAX_COLS = 50;

export const draw: DrawFunc = (ctx, width, height) => {
  let mouseX = 0;
  let mouseY = 0;

  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  let drawing = true;

  let frameId = 0;

  const redraw = () => {
    ctx.clearRect(0, 0, width, height);

    const cols = clamp(mouseX * MAX_COLS, 1, MAX_COLS);
    const rows = clamp(mouseY * MAX_COLS, 1, MAX_COLS);
    const xSize = width / cols;
    const ySize = height / rows;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        ctx.save();
        ctx.translate(x * xSize, y * ySize);

        const r = mapRange(x, 0, cols, 0, 255);
        const g = mapRange(x, cols, 0, 0, 255);
        const b = mapRange(y, 0, rows, 0, 255);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(-1, -1, xSize + 1, ySize + 1);

        ctx.restore();
      }
    }

    const r = mapRange(mouseX, 0, 1, 255, 0);
    const g = mapRange(mouseX, 0, 1, 255, 0);
    const b = mapRange(mouseY, 0, 1, 255, 0);

    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, (width / 2) * mouseX, 0, Math.PI * 2);
    ctx.stroke();

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
