import React from "react";
import { useSlideshow } from "../SlideshowContext";
import { useUser } from "../UserContext";

import * as styles from "./LayoutFooter.module.scss";

const LayoutFooter: React.FC = () => {
  const { currentSlide, totalSlides } = useSlideshow();
  const { userCount, disabled } = useUser();

  return (
    <aside className={styles.aside}>
      <div className={styles.left}>
        <div>
          {currentSlide + 1} / {totalSlides}
        </div>
        {disabled ? (
          <div>Non interactive</div>
        ) : (
          <div>
            {userCount} {userCount > 1 ? "people" : "person"}
          </div>
        )}
      </div>
    </aside>
  );
};

export { LayoutFooter };
