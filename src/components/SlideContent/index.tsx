import React from "react";
import { usePagination } from "../../utils/hooks/pagination";
import { SlideContentType } from "../../utils/types";
import { Markdown } from "../Common/Markdown";
import { SlideCommon } from "../SlideCommon";

import * as styles from "./SlideContent.module.scss";

interface SlideContentProps extends SlideContentType {}

const SlideContent: React.FC<SlideContentProps> = ({
  content,
  title,
  nonInteractive,
}) => {
  usePagination();

  return (
    <SlideCommon
      title={title}
      className={styles.main}
      nonInteractive={nonInteractive}
    >
      <h1>{content.title}</h1>
      <Markdown className={styles.body}>{content.content}</Markdown>
    </SlideCommon>
  );
};

export { SlideContent };
