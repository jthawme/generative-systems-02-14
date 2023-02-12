import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { getAudio } from "./audio";

import * as styles from "./Equalizer.module.scss";

interface EqualizerProps {
  cols?: number;
  type?: "normal" | "spin";
}

const Equalizer: React.FC<EqualizerProps> = ({
  cols = 10,
  type = "normal",
}) => {
  const [averages, setAverages] = useState([]);

  useEffect(() => {
    let cb = () => {};

    getAudio(cols, (newAverages) => setAverages(newAverages)).then((ret) => {
      if (ret) {
        cb = ret;
      }
    });

    return () => {
      cb();
    };
  }, [cols]);

  return (
    <div className={classNames(styles.wrapper, [styles[type]])}>
      {averages.map((avg, idx) => {
        return (
          <div
            key={idx}
            className={styles.col}
            style={{ "--percent": avg } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
};

export { Equalizer };
