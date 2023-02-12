import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { SlideCommon } from "../SlideCommon";

import * as styles from "./SlidePoll.module.scss";
import { SlidePollType } from "../../utils/types";
import { useUser } from "../UserContext";
import { UserPressData } from "../UserContext/types";
import { EphemeralPress } from "../Common/EphemeralPress";
import { StandardPress } from "../Common/StandardPress";
import { usePagination } from "../../utils/hooks/pagination";

interface SlidePollProps extends SlidePollType {}

const defaultContent: Omit<SlidePollType["content"], "answers" | "question"> = {
  iconLife: 1000,
  withGraphs: true,
  smallIcons: false,
};

const NUM_ICONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];

const SlidePoll: React.FC<SlidePollProps> = ({ title, content }) => {
  usePagination();
  const { presses, onRemove } = useUser();

  const mergedContent = useMemo(() => {
    return {
      iconLife: content.iconLife ?? defaultContent.iconLife,
      withGraphs: content.withGraphs ?? defaultContent.withGraphs,
      smallIcons: content.smallIcons ?? defaultContent.smallIcons,
      answers: content.answers,
      question: content.question,
    };
  }, [content]);

  const percentages = useMemo(() => {
    return presses.reduce((prev, curr) => {
      const idx = Math.floor(curr.x * mergedContent.answers.length);

      if (!prev[idx]) {
        prev[idx] = 0;
      }

      prev[idx]++;

      return {
        ...prev,
      };
    }, {});
  }, [presses]);

  const getIcon = useCallback(
    (item: UserPressData) => {
      const idx = Math.floor(item.x * mergedContent.answers.length);
      return mergedContent.answers[idx].icon || NUM_ICONS[idx];
    },
    [mergedContent.answers],
  );

  return (
    <SlideCommon className={styles.outer} title={title} nonInteractive>
      {presses.map((item) => (
        <EphemeralPress
          key={item.id}
          id={item.id}
          onEnd={() => onRemove(item.id)}
          life={mergedContent.iconLife}
        >
          <StandardPress
            {...item}
            size={mergedContent.smallIcons ? 16 : 48}
            icon={getIcon(item)}
          />
        </EphemeralPress>
      ))}
      <h1 className={styles.title}>{mergedContent.question}</h1>

      {mergedContent.withGraphs && (
        <div className={styles.pool}>
          {mergedContent.answers.map((answer, idx) => (
            <div className={styles.wrapper}>
              <div
                className={styles.circle}
                style={
                  {
                    "--size": presses.length
                      ? (percentages[idx] || 0) / presses.length
                      : 0,
                  } as React.CSSProperties
                }
              />
              <div className={styles.title}>{answer.answer}</div>
            </div>
          ))}
        </div>
      )}
    </SlideCommon>
  );
};

export { SlidePoll };
