import { clamp, mapRange } from "../../../utils/utils";
import { getAudio } from "../../Equalizer/audio";
import { DrawFunc } from "./common";

export const draw: DrawFunc = async (ctx, width, height) => {
  const redraw = (perc: number) => {
    const cols = 40;
    const rows = 40;
    const size = width / cols;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        ctx.save();
        ctx.translate(x * size, y * size);

        const r = mapRange(clamp(perc, 0, 1), 0, 1, 0, 255);
        const g = mapRange(x, cols, 0, 0, 255);
        const b = mapRange(y, 0, rows, 0, 255);

        ctx.fillStyle = `rgb(${g}, ${r}, ${b})`;
        ctx.fillRect(0, 0, size, size);

        ctx.restore();
      }
    }
  };

  // let cb = () => {};
  const cb = await getAudio(1, (nums) => {
    const num = nums[0];

    redraw(num);
  });

  return () => cb && cb();
};
