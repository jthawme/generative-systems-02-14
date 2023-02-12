import React, { useCallback, useRef } from "react";
import { makeNoise2D } from "fast-simplex-noise";

interface RandomGraphProps {
  perlin?: boolean;
  perlinFactor?: number;
  cols?: number;
  rows?: number;
  height?: number;
  clickToRedraw?: boolean;
  renderCell?: (
    ctx: CanvasRenderingContext2D,
    size: number,
    height: number,
    random: number,
  ) => void;
}

const RandomGraph: React.FC<RandomGraphProps> = ({
  perlin = false,
  perlinFactor = 32,
  cols = 100,
  height = 0.75,
  clickToRedraw = true,
  renderCell = (ctx, size, height, random) =>
    ctx.fillRect(0, 0, size, -(random * height)),
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback((el: HTMLCanvasElement) => {
    const noise = makeNoise2D();

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

    const size = WIDTH / cols;

    for (let x = 0; x < cols; x++) {
      ctx.save();
      ctx.translate(x * size, HEIGHT);
      const r = perlin ? noise(x / perlinFactor, 0) : Math.random();
      // ctx.fillStyle = `rgb(${r * 255}, ${r * 255}, ${r * 255})`;
      renderCell(ctx, size, HEIGHT, r);

      ctx.restore();
    }
  }, []);

  const onCanvasRef = useCallback(
    (el: HTMLCanvasElement | null) => {
      if (el) {
        draw(el);
      }

      canvasRef.current = el;
    },
    [draw],
  );

  const onClick = useCallback(() => {
    if (canvasRef.current && clickToRedraw) {
      draw(canvasRef.current);
    }
  }, [draw, clickToRedraw]);

  return <canvas onClick={onClick} ref={onCanvasRef}></canvas>;
};

export { RandomGraph };
