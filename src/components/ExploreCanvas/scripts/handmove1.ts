import { createVideo, mapRange, videoPlaying } from "../../../utils/utils";
import { DrawFunc } from "./common";
import * as Pose from "./pose";

export const draw: DrawFunc = async (ctx, width, height, canvas) => {
  let drawing = true;

  let frameId = 0;

  const videoEl = createVideo("/hand.mp4", canvas.parentElement);

  await videoPlaying(videoEl);
  await Pose.setup();

  const redraw = async () => {
    ctx.clearRect(0, 0, width, height);

    try {
      const poses = await Pose.estimate(videoEl);

      const rightHand = poses[0].keypoints.find(
        (item) => item.name === "right_wrist",
      );

      const x = mapRange(rightHand.x, 0, videoEl.videoWidth, 0, 1);

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, (width / 2) * x, 0, Math.PI * 2);
      ctx.fill();
    } catch {
      //
    }

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
