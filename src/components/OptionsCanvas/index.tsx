import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { listenCb } from "../../utils/utils";

import * as styles from "./OptionsCanvas.module.scss";
import { draw, Inputs, Outputs } from "./scripts/draw";

interface OptionsCanvasProps {
  height?: number;
}

const inputOptions: [Inputs, string][] = [
  ["mouseX", "Mouse X position"],
  ["mouseY", "Mouse Y position"],
  ["audio", "Volume"],
  ["random", "Random"],
  ["perlin", "Perlin"],
  ["sine", "Sine Wave"],
  ["cosine", "Cosine Wave"],
  ["tangent", "Tangent Wave"],
];

const outputOptions: [Outputs, string][] = [
  ["size", "Circle Size"],
  ["amount", "Amount"],
  ["red", "Red fill"],
  ["green", "Green fill"],
  ["blue", "Blue fill"],
  ["stroke-red", "Red stroke"],
  ["stroke-green", "Green stroke"],
  ["stroke-blue", "Blue stroke"],
  ["fade", "Frame fade"],
  ["height", "Circle position"],
  ["opacity", "Circle Opacity"],
  ["points", "Points on Circle"],
  ["stroke-width", "Stroke Width"],
  ["sine-frequency", "Speed/Frequency of sine wave"],
];

const OptionsCanvas: React.FC<OptionsCanvasProps> = ({ height = 0.75 }) => {
  const cleanupRef = useRef(() => {});
  const resetRef = useRef(() => {});
  const updateRef = useRef<(inputs: Inputs[], outputs: Outputs[]) => void>(
    () => {},
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hide, setHide] = useState<boolean>(false);

  const [inputs, setInputs] = useState<Record<number, Inputs>>({});
  const [outputs, setOutputs] = useState<Record<number, Outputs>>({});

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

      // const { cleanup, update } = await draw(ctx, WIDTH, HEIGHT, canvas, {
      //   amount: 0.5,
      //   size: 0.25,
      //   opacity: 0.25,
      //   "stroke-opacity": 0.25,
      //   fade: 0.1,
      // });
      const { cleanup, update, reset } = await draw(ctx, WIDTH, HEIGHT, canvas);
      cleanupRef.current = cleanup;
      updateRef.current = update;
      resetRef.current = reset;
    }
  }, []);

  useEffect(() => {
    const maxLen = Math.max(
      ...Object.keys(inputs).map((k) => parseInt(k)),
      ...Object.keys(outputs).map((k) => parseInt(k)),
    );

    if (!isFinite(maxLen)) {
      return;
    }

    const transformed = new Array(maxLen + 1).fill(0).reduce(
      (p, c, i) => {
        if (inputs[i] && outputs[i]) {
          p.inputs.push(inputs[i]);
          p.outputs.push(outputs[i]);
        }

        return p;
      },
      {
        inputs: [] as Inputs[],
        outputs: [] as Outputs[],
      },
    );

    updateRef.current(transformed.inputs, transformed.outputs);
  }, [inputs, outputs]);

  const addInput = useCallback(
    (k) => {
      setInputs((s) => {
        if (s[currentIndex] && s[currentIndex] === k) {
          delete s[currentIndex];
        } else {
          s[currentIndex] = k;
        }

        return { ...s };
      });
    },
    [currentIndex],
  );

  const addOutput = useCallback(
    (k) => {
      setOutputs((s) => {
        if (s[currentIndex] && s[currentIndex] === k) {
          delete s[currentIndex];
        } else {
          s[currentIndex] = k;
        }

        return { ...s };
      });
    },
    [currentIndex],
  );

  const numbersUsed = (
    k: Inputs | Outputs,
    record: Record<number, Inputs | Outputs>,
  ) => {
    return (
      <>
        {Object.entries(record)
          .filter((entry) => k === entry[1])
          .map((entry) => (
            <span key={entry.join("-")}>{entry[0]}</span>
          ))}
      </>
    );
  };

  useEffect(() => {
    const unlisten = listenCb(document, "keyup", (e) => {
      const num = parseInt(e.key);

      if (!isNaN(num)) {
        setCurrentIndex(num);
      }

      if (e.key === "Escape") {
        setHide((s) => !s);
      }

      if (e.key === "Backspace") {
        resetRef.current();
      }
    });

    return () => {
      unlisten();
      cleanupRef.current();
    };
  }, []);

  return (
    <div className={classNames(styles.outer, { [styles.hide]: hide })}>
      <div className={styles.left}>
        {inputOptions.map(([val, label]) => (
          <button key={val} onClick={() => addInput(val)}>
            {label} {numbersUsed(val, inputs)}
          </button>
        ))}
      </div>
      <canvas ref={onCanvasRef}></canvas>
      <div className={styles.right}>
        {outputOptions.map(([val, label]) => (
          <button key={val} onClick={() => addOutput(val)}>
            {label} {numbersUsed(val, outputs)}
          </button>
        ))}
      </div>
    </div>
  );
};

export { OptionsCanvas };
