import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { usePagination } from "../../utils/hooks/pagination";
import { SlideMDXType } from "../../utils/types";
import { SlideCommon } from "../SlideCommon";

import * as styles from "./SlideMDX.module.scss";
import classNames from "classnames";

interface SlideMDXProps extends SlideMDXType {}

const SlideMDX: React.FC<SlideMDXProps> = ({
  body,
  title,
  content,
  nonInteractive,
}) => {
  usePagination();

  return (
    <SlideCommon
      className={classNames({ [styles.fullscreen]: content.fullscreen })}
      title={title}
      nonInteractive={nonInteractive}
    >
      <MDXRenderer>{body}</MDXRenderer>
    </SlideCommon>
  );
};

export { SlideMDX };
