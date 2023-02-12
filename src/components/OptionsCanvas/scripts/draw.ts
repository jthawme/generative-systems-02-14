import { clamp, listenCb, mapRange } from "../../../utils/utils";
import { getAudio } from "../../Equalizer/audio";
import { RandomNum } from "./random";
import { SineWave } from "./sine";

type DrawFunc = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  initialValues?: Partial<Record<Outputs, number>>,
) => Promise<{
  reset: () => void;
  update: (inputs: Inputs[], outputs: Outputs[]) => void;
  cleanup: () => void;
}>;

export type Inputs =
  | "mouseX"
  | "mouseY"
  | "audio"
  | "sine"
  | "cosine"
  | "tangent"
  | "random"
  | "perlin";

export type Outputs =
  | "size"
  | "opacity"
  | "stroke-opacity"
  | "points"
  | "red"
  | "green"
  | "blue"
  | "stroke-red"
  | "stroke-green"
  | "stroke-blue"
  | "amount"
  | "height"
  | "sine-frequency"
  | "stroke-width"
  | "fade";

type Options = {
  input: Inputs[];
  output: Outputs[];
};

const getPoint = (angle, radius) => {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
};

const MAX_POINTS = 50;

const initialParams = (initialValues: Partial<Record<Outputs, number>>) => {
  return {
    size: () => initialValues.size || 1,
    opacity: () => initialValues.opacity || 1,
    points: () => initialValues.points || 1,
    red: () => initialValues.red || 0,
    green: () => initialValues.green || 0,
    blue: () => initialValues.blue || 0,
    "stroke-red": () => initialValues["stroke-red"] || 0,
    "stroke-green": () => initialValues["stroke-green"] || 0,
    "stroke-blue": () => initialValues["stroke-blue"] || 0,
    "stroke-opacity": () => initialValues["stroke-opacity"] || 1,
    amount: () => initialValues.amount || 0,
    height: () => initialValues.height || 0.5,
    "sine-frequency": () => initialValues["sine-frequency"] || 0.5,
    "stroke-width": () => initialValues["stroke-width"] || 0,
    fade: () => initialValues.fade || 1,
  };
};

export const draw: DrawFunc = async (
  ctx,
  width,
  height,
  canvas,
  initialValues = {},
) => {
  let mouseX = 0;
  let mouseY = 0;

  let audio = 0;

  let sine = SineWave();
  let cosine = SineWave("cos");
  let tangent = SineWave("tan");
  let random = RandomNum();
  let perlin = RandomNum(true);

  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  let drawing = true;
  let frameId = 0;

  const options: Options = {
    input: [],
    output: [],
  };

  let params: Record<Outputs, (mod?: number) => number> =
    initialParams(initialValues);

  const redraw = () => {
    sine.update();
    cosine.update();
    tangent.update();
    perlin.update();
    random.update();

    options.input.forEach((input, idx) => {
      if (!options.output[idx]) {
        return;
      }

      const mod = (() => {
        switch (input) {
          case "mouseX":
            return () => mouseX;
          case "mouseY":
            return () => mouseY;
          case "audio":
            return () => audio;
          case "sine":
            return (mod = 0) =>
              sine.getAt(
                mod,
                mapRange(params["sine-frequency"](), 0, 1, 2, 80),
              );
          case "cosine":
            return (mod = 0) =>
              cosine.getAt(
                mod,
                mapRange(params["sine-frequency"](), 0, 1, 2, 80),
              );
          case "tangent":
            return (idx = 0) => tangent.getAt(idx, 30);
          case "random":
            return (idx = 0) => random.getAt(idx);
          case "perlin":
            return (idx = 0) => {
              console.log(perlin.getAt(idx));
              return perlin.getAt(idx);
            };
        }
      })();

      params[options.output[idx]] = mod;
    });

    ctx.save();
    ctx.globalAlpha = params.fade();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // ctx.strokeStyle = `rgba(${params.red * 255}, ${params.green * 255}, ${
    //   params.blue * 255
    // }, ${params["stroke-opacity"]})`;

    const totalPoints = clamp(
      Math.ceil(params.points() * MAX_POINTS),
      3,
      MAX_POINTS,
    );
    const angleDiff = (Math.PI * 2) / totalPoints;

    const path = new Path2D();
    for (let i = 0; i < totalPoints; i++) {
      const { x, y } = getPoint(i * angleDiff, height / 2);

      if (i === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.closePath();

    const totalCircles = Math.round(mapRange(params.amount(), 0, 1, 1, 100));
    const circleSegment = width / totalCircles;

    for (let i = 0; i < totalCircles; i++) {
      ctx.save();
      ctx.translate(
        circleSegment * i + circleSegment / 2,
        clamp(params.height(i) * height, 0, height),
      );
      ctx.scale(params.size(i), params.size(i));
      ctx.fillStyle = `rgb(${params.red(i) * 255}, ${params.green(i) * 255}, ${
        params.blue(i) * 255
      })`;
      ctx.globalAlpha = params.opacity();
      ctx.fill(path);
      ctx.restore();

      ctx.save();
      ctx.translate(
        circleSegment * i + circleSegment / 2,
        clamp(params.height(i) * height, 0, height),
      );
      ctx.scale(params.size(i), params.size(i));
      ctx.strokeStyle = `rgb(${params["stroke-red"](i) * 255}, ${
        params["stroke-green"](i) * 255
      }, ${params["stroke-blue"](i) * 255})`;
      ctx.globalAlpha = params["stroke-opacity"]();
      ctx.lineWidth = mapRange(params["stroke-width"](i), 0, 1, 1, 10);
      ctx.stroke(path);
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();

    if (drawing) {
      frameId = requestAnimationFrame(redraw);
    }
  };

  redraw();

  const unlisten = listenCb(document, "mousemove", (e) => {
    mouseX = clamp(mapRange(e.clientX, 0, wWidth, 0, 1), 0, 1);
    mouseY = clamp(mapRange(e.clientY, 0, wHeight, 0, 1), 0, 1);
  });

  const unlistenAudio = await getAudio(1, (nums) => {
    audio = clamp(nums[0], 0, 1);
  });

  return Promise.resolve({
    reset: () => {
      options.input = [];
      options.output = [];

      params = initialParams(initialValues);
    },
    update: (inputs, outputs) => {
      options.input = [...inputs];
      options.output = [...outputs];

      params = initialParams({
        size: params.size(),
        opacity: params.opacity(),
        points: params.points(),
        red: params.red(),
        green: params.green(),
        blue: params.blue(),
        "stroke-red": params["stroke-red"](),
        "stroke-green": params["stroke-green"](),
        "stroke-blue": params["stroke-blue"](),
        "stroke-opacity": params["stroke-opacity"](),
        amount: params.amount(),
        height: params.height(),
        "sine-frequency": params["sine-frequency"](),
        "stroke-width": params["stroke-width"](),
        fade: params.fade(),
      });
    },
    cleanup: () => {
      drawing = false;
      unlisten && unlisten();
      unlistenAudio && unlistenAudio();
      cancelAnimationFrame(frameId);
    },
  });
};
