import { mapRange } from "../../../utils/utils";

export const SineWave = (mathFunc = "sin") => {
  let x = 0;

  const val = (mod = 0, freq = 60) => {
    return mapRange(Math[mathFunc]((x + mod) / freq), -1, 1, 0, 1);
  };

  return {
    update() {
      x = x + 1;
    },
    get value() {
      return val();
    },
    getAt(mod, freq) {
      return val(mod, freq);
    },
  };
};
