import { createVideo, mapRange, videoPlaying } from "../../../utils/utils";
import { DrawFunc } from "./common";
import * as Pose from "./pose";
import { makeNoise2D } from "fast-simplex-noise";

export const draw: DrawFunc = async (ctx, width, height, canvas) => {
  let drawing = true;

  let frameId = 0;

  const videoEl = createVideo("/hand.mp4", canvas.parentElement);

  let lastX = -1;
  let lastY = -1;

  await videoPlaying(videoEl);
  await Pose.setup();

  let frame: number = 0;

  const noise = makeNoise2D();

  const redraw = async () => {
    // ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    try {
      const poses = await Pose.estimate(videoEl);

      const rightHand = poses[0].keypoints.find(
        (item) => item.name === "right_wrist",
      );

      const x = mapRange(rightHand.x, 0, videoEl.videoWidth, 0, 1);
      const y = mapRange(rightHand.y, 0, videoEl.videoHeight, 0, 1);

      if (lastX >= 0) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x * width, y * height);
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = `hsl(${noise(x, frame / 100) * 360}, 100%, 50%)`;
        ctx.stroke();
      }

      lastX = x * width;
      lastY = y * height;
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
    cancelAnimationFrame(frameId);
  };
};
