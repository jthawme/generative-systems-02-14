import React, { useCallback, useEffect, useRef } from "react";

import * as styles from "./GameOfLife.module.scss";

interface GameOfLifeProps {
  cols?: number;
  rows?: number;
  initial?: Array<[number, number]>;
  random?: false | number;
  autoPlay?: boolean;
  withStroke?: boolean;
}

enum CELL_STATE {
  ALIVE = "alive",
  DEAD = "dead",
}

const GameOfLife: React.FC<GameOfLifeProps> = ({
  cols = 100,
  rows = 100,
  initial = [],
  random = 0.5,
  autoPlay = true,
  withStroke = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const autoPlayRef = useRef(autoPlay);
  const killitRef = useRef(false);
  const nextFrame = useRef(false);

  const onCanvasRef = useCallback(
    (el: HTMLCanvasElement | null) => {
      if (el) {
        canvasRef.current = el;
        ctxRef.current = el.getContext("2d");

        const WIDTH = window.innerHeight * 0.75;
        const HEIGHT = window.innerHeight * 0.75;
        const CELL_SIZE = WIDTH / cols;

        let cells = new Array(rows).fill(0).map((v, y) =>
          new Array(cols).fill(0).map((_v, x) => {
            if (initial.length) {
              if (initial.find((c) => c[1] === x && c[0] === y)) {
                return CELL_STATE.ALIVE;
              } else {
                return CELL_STATE.DEAD;
              }
            } else {
              if (random) {
                return Math.random() > random
                  ? CELL_STATE.ALIVE
                  : CELL_STATE.DEAD;
              }
            }

            return CELL_STATE.DEAD;
          }),
        );

        const updateState = (x, y) => {
          const safeguard = (_x, _y) => {
            try {
              return cells[_x][_y];
            } catch {
              return CELL_STATE.DEAD;
            }
          };

          const neighbours = [
            safeguard(x - 1, y - 1),
            safeguard(x, y - 1),
            safeguard(x + 1, y - 1),
            safeguard(x - 1, y),
            // safeguard(x,y),
            safeguard(x + 1, y),
            safeguard(x - 1, y + 1),
            safeguard(x, y + 1),
            safeguard(x + 1, y + 1),
          ].filter((c) => c === CELL_STATE.ALIVE);

          if (cells[x][y] === CELL_STATE.ALIVE && neighbours.length < 2) {
            return CELL_STATE.DEAD;
          }
          if (
            (neighbours.length === 2 || neighbours.length === 3) &&
            cells[x][y] === CELL_STATE.ALIVE
          ) {
            return CELL_STATE.ALIVE;
          }
          if (cells[x][y] === CELL_STATE.ALIVE && neighbours.length > 3) {
            return CELL_STATE.DEAD;
          }
          if (cells[x][y] === CELL_STATE.DEAD && neighbours.length === 3) {
            return CELL_STATE.ALIVE;
          }
          return cells[x][y];
        };

        const update = () => {
          const ctx = ctxRef.current;
          ctx.fillStyle = "red";
          ctx.strokeStyle = "red";

          ctx.clearRect(0, 0, WIDTH, HEIGHT);

          for (let x = 0; x < cells.length; x++) {
            for (let y = 0; y < cells[x].length; y++) {
              ctx.save();
              ctx.translate(x * CELL_SIZE, y * CELL_SIZE);

              ctx.beginPath();
              ctx.rect(0, 0, CELL_SIZE, CELL_SIZE);

              if (withStroke) {
                ctx.stroke();
              }

              if (cells[x][y] === CELL_STATE.ALIVE) {
                ctx.fill();
              }
              ctx.restore();
            }
          }

          if (autoPlay || nextFrame.current) {
            const next_cells = [];
            for (let x = 0; x < cells.length; x++) {
              next_cells.push([]);
              for (let y = 0; y < cells[x].length; y++) {
                next_cells[x].push(updateState(x, y));
              }
            }

            if (!autoPlay) {
              nextFrame.current = false;
            }

            cells = next_cells;
          }

          if (!killitRef.current) {
            requestAnimationFrame(() => {
              setTimeout(() => {
                update();
              }, 60);
            });
          }
        };

        const setCanvasSize = (w, h) => {
          const dpr = window.devicePixelRatio;

          canvasRef.current.width = w * dpr;
          canvasRef.current.height = h * dpr;
          canvasRef.current.style.width = `${w}px`;
          canvasRef.current.style.height = `${h}px`;

          ctxRef.current.scale(dpr, dpr);
        };

        setCanvasSize(window.innerHeight * 0.75, window.innerHeight * 0.75);

        update();
      }
    },
    [autoPlay, withStroke],
  );

  const onRestart = useCallback(() => {
    killitRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        killitRef.current = false;
        onCanvasRef(canvasRef.current);
      });
    });
  }, []);

  useEffect(() => {
    return () => {
      killitRef.current = true;
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas ref={onCanvasRef} />

      {!autoPlay && (
        <div className={styles.actions}>
          <button onClick={() => (nextFrame.current = true)}>Next frame</button>
        </div>
      )}
    </div>
  );
};

export { GameOfLife };
