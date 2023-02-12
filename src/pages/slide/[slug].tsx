import { PageProps, graphql, Link } from "gatsby";
import { navigate } from "@reach/router";
import React, { useEffect } from "react";

interface MainData {
  slides: {
    edges: Array<{
      node: {
        slug: string;
        frontmatter: {
          order: number;
        };
      };
    }>;
  };
}

// markup
const SlidePage: React.FC<PageProps<MainData>> = ({ data, params }) => {
  useEffect(() => {
    const num = parseInt(params.slug);

    if (
      !isNaN(num) &&
      data.slides.edges.find(({ node }) => node.frontmatter.order === num)
    ) {
      const slide = data.slides.edges.find(
        ({ node }) => node.frontmatter.order === num,
      );

      window.location.href = `/slide/${slide.node.slug}`;
    } else {
      window.location.href = "/";
    }
  }, [data.slides, params]);

  return null;
};

export const query = graphql`
  query SlidePageQuery {
    slides: allMdx(
      filter: {
        fileAbsolutePath: { regex: "/(slides)/" }
        frontmatter: { ignore: { ne: true } }
      }
      sort: { fields: fields___order, order: ASC }
    ) {
      edges {
        node {
          slug
          frontmatter {
            order
          }
        }
      }
    }
  }
`;

export default SlidePage;
