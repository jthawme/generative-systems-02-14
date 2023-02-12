import { PageProps, graphql, Link } from "gatsby";
import { Redirect } from "@reach/router";
import React, { useEffect, useMemo, useState } from "react";
import { DevicePage } from "../components/DevicePage";
import { Layout } from "../components/Layout";
import { Slides } from "../utils/types";

interface MainData {
  site: {
    siteMetadata: {
      nonInteractive: boolean;
    };
  };
  slides: {
    edges: Array<{
      node: Slides;
    }>;
  };
  first: {
    edges: Array<{
      node: {
        slug: string;
      };
    }>;
  };
}

// markup
const IndexPage: React.FC<PageProps<MainData>> = ({ data, location }) => {
  const [isLocal, setIsLocal] = useState(false);

  const firstSlide = useMemo(() => {
    return data.first.edges.length ? data.first.edges[0].node.slug : false;
  }, [data.first]);

  useEffect(() => {
    setIsLocal(location.hostname.includes("localhost"));
  }, []);

  return (
    <>
      {isLocal && (
        <>
          {firstSlide && (
            <Link
              style={{ position: "fixed", top: 0, left: 0, zIndex: 20 }}
              to={`/slide/${firstSlide}`}
            >
              Go to slides
            </Link>
          )}
        </>
      )}

      {data.site.siteMetadata.nonInteractive === false ? <DevicePage /> : null}
    </>
  );
};

export const query = graphql`
  query HomePageQuery {
    site {
      siteMetadata {
        nonInteractive
      }
    }
    slides: allMdx(filter: { fileAbsolutePath: { regex: "/(slides)/" } }) {
      edges {
        node {
          slug
        }
      }
    }
    first: allMdx(
      filter: { fileAbsolutePath: { regex: "/(slides)/" } }
      sort: { fields: fields___order, order: ASC }
      limit: 1
    ) {
      edges {
        node {
          slug
        }
      }
    }
  }
`;

export default IndexPage;
