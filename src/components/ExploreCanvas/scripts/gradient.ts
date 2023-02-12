import { mapRange } from "../../../utils/utils";
import { DrawFunc } from "./common";

export const draw: DrawFunc = (ctx, width, height) => {
  const cols = 40;
  const rows = 40;
  const size = width / cols;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      ctx.save();
      ctx.translate(x * size, y * size);

      const r = mapRange(x, 0, cols, 0, 255);
      const g = mapRange(x, cols, 0, 0, 255);
      const b = mapRange(y, 0, rows, 0, 255);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, 0, size, size);

      ctx.restore();
    }
  }

  return Promise.resolve(() => {});
};
