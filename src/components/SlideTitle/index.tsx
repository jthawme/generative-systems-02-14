import { GatsbyImage } from "gatsby-plugin-image";
import React from "react";
import { usePagination } from "../../utils/hooks/pagination";
import { SlideTitleType } from "../../utils/types";
import { PressDisplay } from "../Common/PressesDisplay";
import { SlideCommon } from "../SlideCommon";
import { useSlideshow } from "../SlideshowContext";

import * as styles from "./SlideTitle.module.scss";

interface SlideTitleProps extends SlideTitleType {}

const SlideTitle: React.FC<SlideTitleProps> = ({
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
      {content.image && (
        <GatsbyImage
          className={styles.image}
          image={content.image.childImageSharp.gatsbyImageData}
          alt=""
        />
      )}
      <h1>{content.title}</h1>
      {content.subtitle && <h2>{content.subtitle}</h2>}
    </SlideCommon>
  );
};

export { SlideTitle };
