export type DrawFunc = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
) => Promise<() => void>;
