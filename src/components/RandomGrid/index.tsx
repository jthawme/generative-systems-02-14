import React, { useCallback, useRef } from "react";
import { makeNoise2D } from "fast-simplex-noise";

interface RandomGridProps {
  perlin?: boolean;
  perlinFactor?: number;
  cols?: number;
  rows?: number;
  height?: number;
  clickToRerun?: boolean;
  renderCell?: (
    ctx: CanvasRenderingContext2D,
    size: number,
    random: number,
    vars: {
      lastRandom: number;
      firstRandom: number;
    },
  ) => void;
}

const RandomGrid: React.FC<RandomGridProps> = ({
  perlin = false,
  perlinFactor = 64,
  cols = 100,
  rows = 100,
  height = 0.75,
  clickToRerun = true,
  renderCell = (ctx, size) => ctx.fillRect(0, 0, size, size),
}) => {
  const elRef = useRef<HTMLCanvasElement | null>(null);

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

    let lastRandom: number = null;
    let firstRandom: number = null;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        ctx.save();
        ctx.translate(x * size, y * size);
        const r = perlin
          ? noise(x / perlinFactor, y / perlinFactor)
          : Math.random();
        ctx.fillStyle = `rgb(${r * 255}, ${r * 255}, ${r * 255})`;
        renderCell(ctx, size, r, {
          lastRandom,
          firstRandom: firstRandom || r,
        });
        lastRandom = r;

        if (firstRandom === null) {
          firstRandom = r;
        }

        ctx.restore();
      }
    }
  }, []);

  const onCanvasRef = useCallback(
    (el: HTMLCanvasElement | null) => {
      if (el) {
        draw(el);
      }
      elRef.current = el;
    },
    [draw],
  );

  const onClick = useCallback(() => {
    if (elRef.current && clickToRerun) {
      draw(elRef.current);
    }
  }, [draw]);

  return <canvas onClick={onClick} ref={onCanvasRef}></canvas>;
};

export { RandomGrid };
