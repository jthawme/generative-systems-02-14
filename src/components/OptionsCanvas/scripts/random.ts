import { makeNoise2D } from "fast-simplex-noise";
import { clamp, mapRange } from "../../../utils/utils";

export const RandomNum = (
  perlin = false,
  { perlinFactor = 100, randomFreq = 5, max = 50 } = {},
) => {
  let x = 0;
  const noise = makeNoise2D();
  let current = Math.random();
  let previous = [current];

  const val = (mod = 0) => {
    console.log(previous);
    return perlin
      ? mapRange(noise((x + mod) / perlinFactor, 0), -1, 1, 0, 1)
      : previous[Math.round(mod) % previous.length];
  };

  return {
    update() {
      x = x + 1;

      if (x % randomFreq === 0) {
        current = Math.random();
        previous.unshift(current);
        previous = previous.slice(0, 50);
      }
    },
    get value() {
      return val();
    },
    getAt(mod) {
      return val(mod);
    },
  };
};
