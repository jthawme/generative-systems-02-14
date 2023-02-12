import { useStaticQuery, graphql, navigate } from "gatsby";
import { useMatch } from "@reach/router";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { clamp } from "@tensorflow/tfjs-core/dist/util_base";

interface SlideshowContextProps {
  totalSlides: number;
  currentSlide: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextSlide: () => void;
  prevSlide: () => void;
  jumpTo: (num: number) => void;
}

const SlideshowContext = createContext<SlideshowContextProps>({
  totalSlides: 0,
  currentSlide: 0,
  hasNext: false,
  hasPrev: false,
  nextSlide: () => false,
  prevSlide: () => false,
  jumpTo: () => false,
});

interface SlideDataQuery {
  slides: {
    edges: Array<{
      node: {
        frontmatter: {
          titles;
        };
        fields: {
          order: number;
        };
        slug: string;
      };
    }>;
  };
}

const SlideshowContainer: React.FC = ({ children }) => {
  const match = useMatch(`/slide/:slideSlug`);

  const data = useStaticQuery<SlideDataQuery>(graphql`
    query {
      slides: allMdx(
        filter: {
          fileAbsolutePath: { regex: "/(slides)/" }
          frontmatter: { ignore: { ne: true } }
        }
        sort: { fields: fields___order, order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              type
            }
            fields {
              order
            }
            slug
          }
        }
        totalCount
      }
    }
  `);

  const pages = useMemo(() => {
    return data.slides.edges.map(({ node }) => {
      return node.slug.charAt(node.slug.length - 1) == "/"
        ? node.slug.substr(0, node.slug.length - 1)
        : node.slug;
    });
  }, [data]);

  const totalSlides = useMemo(() => {
    return pages.length;
  }, [pages]);

  const currentSlide = useMemo(() => {
    return pages.indexOf(match.slideSlug);
  }, [match, pages]);

  const hasNext = useMemo(() => {
    return currentSlide + 1 <= pages.length - 1;
  }, [currentSlide, pages]);

  const hasPrev = useMemo(() => {
    return currentSlide - 1 >= 0;
  }, [currentSlide, pages]);

  const nextSlide = useCallback(() => {
    if (hasNext) {
      const nextSlug = pages[currentSlide + 1];

      navigate(`/slide/${nextSlug}`);
    }
  }, [pages, currentSlide, hasNext]);

  const prevSlide = useCallback(() => {
    if (hasPrev) {
      const prevSlug = pages[currentSlide - 1];

      navigate(`/slide/${prevSlug}`);
    }
  }, [pages, currentSlide, hasPrev]);

  const jumpTo = useCallback(
    (num: number) => {
      const slug = pages[clamp(num, 0, totalSlides)];

      navigate(`/slide/${slug}`);
    },
    [totalSlides],
  );

  return (
    <SlideshowContext.Provider
      value={{
        currentSlide,
        totalSlides,
        prevSlide,
        hasPrev,
        hasNext,
        nextSlide,
        jumpTo,
      }}
    >
      {children}
    </SlideshowContext.Provider>
  );
};

const useSlideshow = () => useContext(SlideshowContext);

export { SlideshowContainer, useSlideshow };
