import { useEffect, useState } from "react";
import { useSlideshow } from "../../components/SlideshowContext";

const usePagination = ({ nextDisabled = false, prevDisabled = false } = {}) => {
  const { prevSlide, nextSlide, jumpTo } = useSlideshow();

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && !nextDisabled) {
        nextSlide();
      }
      if (e.key === "ArrowLeft" && !prevDisabled) {
        prevSlide();
      }

      if (e.ctrlKey && e.key === "g") {
        const number = prompt("What slide?");

        if (!isNaN(parseInt(number))) {
          jumpTo(parseInt(number));
        }
      }
    };

    document.addEventListener("keyup", onKeyUp, false);

    return () => document.removeEventListener("keyup", onKeyUp);
  }, [nextSlide, prevSlide, nextDisabled, prevDisabled, jumpTo]);
};

export { usePagination };
