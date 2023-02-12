import React, { useCallback, useEffect, useRef } from "react";
import { draw as GradientDraw } from "./scripts/gradient";
import { draw as GradientAudioDraw } from "./scripts/gradientaudio";
import { draw as MouseMove1Draw } from "./scripts/mousemove1";
import { draw as MouseMove2Draw } from "./scripts/mousemove2";
import { draw as MouseMove3Draw } from "./scripts/mousemove3";
import { draw as HandMove1Draw } from "./scripts/handmove1";
import { draw as HandMove2Draw } from "./scripts/handmove2";
import { draw as HandMove3Draw } from "./scripts/handmove3";

interface ExploreCanvasProps {
  height?: number;
  type?:
    | "gradient"
    | "gradientaudio"
    | "mousemove1"
    | "mousemove2"
    | "mousemove3"
    | "handmove1"
    | "handmove2"
    | "handmove3";
}

const ExploreCanvas: React.FC<ExploreCanvasProps> = ({
  height = 0.75,
  type = "gradient",
}) => {
  const cleanupRef = useRef(() => {});

  const onCanvasRef = useCallback(async (el: HTMLCanvasElement | null) => {
    if (el) {
      const canvas = el;
      const ctx = canvas.getContext("2d");

      const WIDTH = Math.floor(window.innerHeight * height);
      const HEIGHT = Math.floor(window.innerHeight * height);
      const dpr = window.devicePixelRatio;

      canvas.width = dpr * WIDTH;
      canvas.height = dpr * HEIGHT;
      canvas.style.width = `${WIDTH}px`;
      canvas.style.height = `${HEIGHT}px`;
      ctx.scale(dpr, dpr);

      switch (type) {
        case "gradient":
          cleanupRef.current = await GradientDraw(ctx, WIDTH, HEIGHT, canvas);
          break;
        case "gradientaudio":
          cleanupRef.current = await GradientAudioDraw(
            ctx,
            WIDTH,
            HEIGHT,
            canvas,
          );
          break;
        case "mousemove1":
          cleanupRef.current = await MouseMove1Draw(ctx, WIDTH, HEIGHT, canvas);
          break;
        case "mousemove2":
          cleanupRef.current = await MouseMove2Draw(ctx, WIDTH, HEIGHT, canvas);
          break;
        case "mousemove3":
          cleanupRef.current = await MouseMove3Draw(ctx, WIDTH, HEIGHT, canvas);
          break;
        case "handmove1":
          cleanupRef.current = await HandMove1Draw(ctx, WIDTH, HEIGHT, canvas);
          break;
        case "handmove2":
          cleanupRef.current = await HandMove2Draw(ctx, WIDTH, HEIGHT, canvas);
          break;
        case "handmove3":
          cleanupRef.current = await HandMove3Draw(ctx, WIDTH, HEIGHT, canvas);
          break;
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  return (
    <span>
      <canvas ref={onCanvasRef}></canvas>
    </span>
  );
};

export { ExploreCanvas };
