import React from "react";

import { LayoutFooter } from "../LayoutFooter";

import * as styles from "./Layout.module.scss";

const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.outer}>
      <main className={styles.main}>{children}</main>

      <LayoutFooter />
    </div>
  );
};

export { Layout };
