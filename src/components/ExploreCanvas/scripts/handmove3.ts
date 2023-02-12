import {
  createVideo,
  listenCb,
  mapRange,
  videoPlaying,
} from "../../../utils/utils";
import { DrawFunc } from "./common";
import * as Pose from "./pose";
import { makeNoise2D } from "fast-simplex-noise";
import { getAudio } from "../../Equalizer/audio";
import { clamp } from "@tensorflow/tfjs-core/dist/util_base";

const MAX_ROWS = 10;
const POINTS = 50;

const MAX_BLUR = 100;

const PAD_Y = 0.2;

export const draw: DrawFunc = async (ctx, width, height, canvas) => {
  let mouseX = 0;
  let mouseY = 0;
  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  let drawing = true;

  let frameId = 0;

  const videoEl = createVideo("/hand.mp4", canvas.parentElement);

  await videoPlaying(videoEl);
  await Pose.setup();

  let frame: number = 0;

  let volume: number = 0;

  const noise = makeNoise2D();

  const colStep = width / POINTS;
  const rowStep = height * 0.2;

  const audioCb = await getAudio(1, (nums) => {
    volume = nums[0] * 2;
  });

  const unlisten = listenCb(document, "mousemove", (e) => {
    mouseX = clamp(mapRange(e.clientX, 0, wWidth, 0, 1), 0, 1);
    mouseY = clamp(mapRange(e.clientY, 0, wHeight, 0, 1), 0, 1);
  });

  const redraw = async () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    try {
      const poses = await Pose.estimate(videoEl);

      const rightHand = poses[0].keypoints.find(
        (item) => item.name === "right_wrist",
      );

      const handx = mapRange(rightHand.x, 0, videoEl.videoWidth, 0, 1);
      // const handy = mapRange(rightHand.y, 0, videoEl.videoHeight, 0, 1);

      for (let row = Math.floor(MAX_ROWS * mouseY); row >= 0; row--) {
        ctx.save();
        ctx.globalAlpha = mapRange(row, 0, MAX_ROWS, 1, 0.3);
        ctx.filter = `blur(${mapRange(
          row,
          0,
          MAX_ROWS,
          0,
          handx * MAX_BLUR,
        )}px)`;
        ctx.beginPath();
        ctx.translate(
          0,
          mapRange(row, MAX_ROWS - 1, 0, 0, height * (1 - PAD_Y * 2)) +
            height * PAD_Y,
        );
        for (let x = 0; x <= POINTS; x++) {
          const centreDist = clamp(
            mapRange(Math.abs(x - POINTS / 2), 0, POINTS / 2, 1, -0.5),
            0,
            1,
          );

          // console.log(x, centreDist);
          const y =
            mapRange(
              noise(x * 20, row - frame / 10),
              -1,
              1,
              0,
              rowStep * volume,
            ) * centreDist;

          if (x === 0) {
            ctx.moveTo(x * colStep, -y);
          } else {
            ctx.lineTo(x * colStep, -y);
          }
        }
        // ctx.save();
        // ctx.globalCompositeOperation = "destination-out";
        // ctx.fill();
        // ctx.restore();

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fill();
        ctx.restore();

        ctx.stroke();
        ctx.restore();
      }
    } catch {
      //
    }

    frame++;

    if (drawing) {
      frameId = requestAnimationFrame(redraw);
    }
  };

  redraw();

  return () => {
    videoEl.remove();
    drawing = false;
    audioCb && audioCb();
    unlisten();
    cancelAnimationFrame(frameId);
  };
};
