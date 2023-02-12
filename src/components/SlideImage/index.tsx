import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { GatsbyImage } from "gatsby-plugin-image";
import { usePagination } from "../../utils/hooks/pagination";
import { SlideImageType } from "../../utils/types";
import { useSlideshow } from "../SlideshowContext";

import * as styles from "./SlideImage.module.scss";
import { SlideCommon } from "../SlideCommon";

interface SlideImageProps extends SlideImageType {}

const SlideImage: React.FC<SlideImageProps> = ({
  content,
  title,
  nonInteractive,
}) => {
  usePagination();

  const [imageIndex, setImageIndex] = useState(0);

  const speed = useMemo(() => {
    return content.speed || 1000;
  }, [content.speed]);

  const images = useMemo(() => {
    const arr = content.image ? [content.image] : content.images;

    console.log(arr, content);

    return arr.map(
      (item) => item.childImageSharp?.gatsbyImageData || item.publicURL,
    );
  }, [content]);

  useEffect(() => {
    if (images.length > 1) {
      let int = setInterval(() => {
        setImageIndex((n) => (n + 1) % images.length);
      }, speed);

      return () => clearInterval(int);
    }
  }, [images, speed]);

  return (
    <SlideCommon title={title} nonInteractive={nonInteractive}>
      <div
        className={classNames(styles.main, { [styles.inset]: content.inset })}
      >
        {images.map((image, idx) => {
          return typeof image === "string" ? (
            <img
              key={idx}
              className={classNames(styles.image, {
                [styles.imageInset]: content.inset,
                [styles.show]: idx <= imageIndex,
              })}
              src={image}
            />
          ) : (
            <GatsbyImage
              key={idx}
              className={classNames(styles.image, {
                [styles.show]: idx <= imageIndex,
              })}
              image={image}
              objectFit={content.inset ? "contain" : "cover"}
              alt=""
            />
          );
        })}
      </div>
    </SlideCommon>
  );
};

export { SlideImage };
