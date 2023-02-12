import React, { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "../../../utils/hooks/windowDimensions";
import { ReactComponent as JTDvd } from "./jt-dvd.svg";

import * as styles from "./DVDLogo.module.scss";

const COLORS = ["#f44336", "#03a9f4", "#4caf50", "#00bcd4"];
const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

const DVDLogo: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [color, setColor] = useState(getRandomColor());
  const dvdRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const accelerationRef = useRef<{ x: number; y: number }>({
    x: Math.random() + 1,
    y: Math.random() + 1,
  });
  const widthRef = useRef(0);
  const heightRef = useRef(0);

  useEffect(() => {
    widthRef.current = width || 0;
    heightRef.current = height || 0;
  }, [width, height]);

  useEffect(() => {
    let stop = false;
    const update = () => {
      if (!heightRef.current || !widthRef.current) {
        requestAnimationFrame(update);
        return;
      }

      positionRef.current.x += accelerationRef.current.x;
      positionRef.current.y += accelerationRef.current.y;

      if (positionRef.current.y + 151 > (heightRef.current || 0)) {
        accelerationRef.current.y = accelerationRef.current.y * -1;
        setColor(getRandomColor());
      }
      if (positionRef.current.x + 200 > (widthRef.current || 0)) {
        accelerationRef.current.x = accelerationRef.current.x * -1;
        setColor(getRandomColor());
      }
      if (positionRef.current.y < 0) {
        accelerationRef.current.y = accelerationRef.current.y * -1;
        setColor(getRandomColor());
      }
      if (positionRef.current.x < 0) {
        accelerationRef.current.x = accelerationRef.current.x * -1;
        setColor(getRandomColor());
      }

      if (dvdRef.current) {
        dvdRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
      }

      if (!stop) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);

    return () => {
      stop = true;
    };
  }, []);

  return (
    <div ref={dvdRef} className={styles.logo} style={{ color }}>
      <JTDvd />
    </div>
  );
};

export { DVDLogo };
