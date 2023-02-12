import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "../UserContext";
import { addEvent } from "../UserContext/db";
import { DBEventType, UserPressData } from "../UserContext/types";

import * as styles from "./DevicePage.module.scss";

const normalizePosition = (e: React.MouseEvent | React.TouchEvent) => {
  if ("touches" in e) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  return {
    x: e.clientX,
    y: e.clientY,
  };
};

const iconList: string[] = ["❤️", "🎉", "🍻", "🤖", "💃", "🕺"];

const DevicePage: React.FC = () => {
  const timerRef = useRef(0);
  const disabledRef = useRef(false);
  const [icon, setIcon] = useState<string>(iconList[0]);
  const [color, setColor] = useState<string>("red");
  const [pos, setPos] = useState<UserPressData | false>(false);

  const onSlideClick = useCallback(
    (e) => {
      if (!disabledRef.current) {
        disabledRef.current = true;

        const position = normalizePosition(e);
        const top = e.target.offsetTop;
        const left = e.target.offsetLeft;

        const divX = position.x - left;
        const divY = position.y - top;

        const { width, height } = e.target.getBoundingClientRect();

        const percX = divX / width;
        const percY = divY / height;

        timerRef.current = window.setTimeout(() => {
          setPos({
            x: percX,
            y: percY,
          });

          addEvent(DBEventType.Location, {
            x: percX,
            y: percY,
            icon,
            color,
          }).then(() => {
            disabledRef.current = false;
          });
          // .catch(() => {
          //   console.log("hey");
          // });
        }, 100);
      }
    },
    [color, icon],
  );

  return (
    <div className={styles.wrapper}>
      <h2>Interact with my slides</h2>

      <div className={styles.slide} onClick={onSlideClick}>
        {pos && (
          <span
            className={styles.slideEl}
            style={
              { "--pos-x": pos.x, "--pos-y": pos.y } as React.CSSProperties
            }
          />
        )}
        <p>
          Tap anywhere in here
          <span>(Turn landscape for fullscreen)</span>
        </p>
      </div>

      <h3>Choose an icon to point with</h3>
      <div className={styles.icons}>
        {iconList.map((i) => (
          <span
            key={i}
            className={classNames(styles.item, { [styles.active]: icon === i })}
            onClick={() => setIcon(i)}
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
};

export { DevicePage };
