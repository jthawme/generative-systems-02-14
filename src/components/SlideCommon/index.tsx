import classNames from "classnames";
import React from "react";
import { PressDisplay } from "../Common/PressesDisplay";

import * as styles from "./SlideCommon.module.scss";

interface SlideCommonProps {
  title?: string;
  className?: string;
  nonInteractive?: boolean;
}

const SlideCommon: React.FC<SlideCommonProps> = ({
  title,
  children,
  className,
  nonInteractive = false,
}) => {
  return (
    <div className={styles.outer}>
      {title && (
        <header>
          <span>{title}</span>
        </header>
      )}
      <div className={classNames(styles.content, className)}>{children}</div>

      {!nonInteractive && <PressDisplay />}
    </div>
  );
};

export { SlideCommon };
