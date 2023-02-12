import { PageProps, graphql } from "gatsby";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DndProvider,
  DropTargetMonitor,
  useDrag,
  useDrop,
  XYCoord,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SlideType } from "../utils/types";

import * as styles from "../styles/pages/Reorder.module.scss";
import classNames from "classnames";

interface MainData {
  slides: {
    edges: Array<{
      node: {
        id: string;
        slug: string;
        fields: {
          order: number;
        };
        frontmatter: {
          title: string;
          type: SlideType;
        };
      };
    }>;
  };
}

interface ListItemProps {
  id: any;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ListItem: React.FC<ListItemProps> = ({
  id,
  children,
  index,
  moveCard,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "item",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "item",
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={classNames(styles.item, { [styles.dragging]: isDragging })}
      data-handler-id={handlerId}
    >
      {children}
    </div>
  );
};

const List: React.FC<{ slides: MainData["slides"] }> = ({ slides }) => {
  const [currentSlides, setCurrentSlides] = useState(slides.edges);

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setCurrentSlides((s) => {
        const ns = s.slice();
        const dragItem = ns[dragIndex];

        ns.splice(dragIndex, 1);
        ns.splice(hoverIndex, 0, dragItem);

        return ns;
      });
    },
    [currentSlides],
  );

  useEffect(() => {
    const newOrder = currentSlides.map((slide, idx) => {
      return {
        order: idx,
        slug: slide.node.slug,
      };
    });

    fetch(`/api/reorder`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data));
  }, [currentSlides]);

  return (
    <div>
      {currentSlides.map((slide, idx) => (
        <ListItem
          id={slide.node.id}
          index={idx}
          moveCard={moveCard}
          key={slide.node.id}
        >
          <span className={styles.title}>
            {slide.node.frontmatter.title || "No Title"}
          </span>
          <span className={styles.info}>
            {slide.node.slug} / {slide.node.frontmatter.type}
          </span>
        </ListItem>
      ))}
    </div>
  );
};

// markup
const ReorderPage: React.FC<PageProps<MainData>> = ({ data }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <List slides={data.slides} />
    </DndProvider>
  );
};

export const query = graphql`
  query ReorderPageQuery {
    slides: allMdx(
      filter: { fileAbsolutePath: { regex: "/(slides)/" } }
      sort: { fields: fields___order, order: ASC }
    ) {
      edges {
        node {
          id
          slug
          fields {
            order
          }
          frontmatter {
            title
            type
          }
        }
      }
    }
  }
`;

export default ReorderPage;
