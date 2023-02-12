import React from "react";

import * as styles from "./CentreCols.module.scss";

const CentreCols = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.pool}>{children}</div>
    </div>
  );
};

export { CentreCols };
