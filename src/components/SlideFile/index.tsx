import React, { useMemo } from "react";
import classNames from "classnames";
import { GatsbyImage } from "gatsby-plugin-image";
import { usePagination } from "../../utils/hooks/pagination";
import { SlideFileType } from "../../utils/types";
import { useSlideshow } from "../SlideshowContext";

import * as styles from "./SlideFile.module.scss";
import { SlideCommon } from "../SlideCommon";

interface SlideFileProps extends SlideFileType {}

const SlideFile: React.FC<SlideFileProps> = ({
  content,
  title,
  nonInteractive,
}) => {
  usePagination();

  const isVideo = useMemo(() => {
    return ["mp4"].includes(content.file.extension);
  }, [content.file.extension]);

  const isGif = useMemo(() => {
    return ["gif"].includes(content.file.extension);
  }, [content.file.extension]);

  const isFile = useMemo(() => {
    return !isVideo && !isGif;
  }, [isVideo, isGif]);

  return (
    <SlideCommon title={title} nonInteractive={nonInteractive}>
      <div
        className={classNames(styles.main, { [styles.inset]: content.inset })}
      >
        {isGif && <img className={styles.media} src={content.file.publicURL} />}
        {isVideo && (
          <video
            className={styles.media}
            src={content.file.publicURL}
            {...content.videoProperties}
          />
        )}
        {isFile && (
          <a href={content.file.publicURL} className={styles.download} download>
            Download
          </a>
        )}
      </div>
    </SlideCommon>
  );
};

export { SlideFile };
