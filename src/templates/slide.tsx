import React, { useMemo } from "react";
import { graphql, PageProps } from "gatsby";
import { Slides, SlideType } from "../utils/types";
import { SlideshowContainer } from "../components/SlideshowContext";
import { SlideTitle } from "../components/SlideTitle";
import { Layout } from "../components/Layout";
import { SlideImage } from "../components/SlideImage";
import { SlideMDX } from "../components/SlideMDX";
import { SlideFile } from "../components/SlideFile";
import { SlidePoll } from "../components/SlidePoll";
import { SlideContent } from "../components/SlideContent";

interface SlideTemplateProps {
  content: {
    frontmatter: Slides;
    body: string;
  };
}

const SlideTemplate: React.FC<PageProps<SlideTemplateProps>> = ({ data }) => {
  const frontmatter = useMemo(() => {
    switch (data.content.frontmatter.type) {
      default:
        return data.content.frontmatter;
    }
  }, [data.content.frontmatter]);
  return (
    <SlideshowContainer>
      <Layout>
        {frontmatter.type === SlideType.Title && (
          <SlideTitle {...frontmatter} />
        )}
        {frontmatter.type === SlideType.Content && (
          <SlideContent {...frontmatter} />
        )}
        {frontmatter.type === SlideType.Image && (
          <SlideImage {...frontmatter} />
        )}
        {frontmatter.type === SlideType.File && <SlideFile {...frontmatter} />}
        {frontmatter.type === SlideType.MDX && (
          <SlideMDX {...frontmatter} body={data.content.body} />
        )}
        {frontmatter.type === SlideType.Poll && <SlidePoll {...frontmatter} />}
      </Layout>
    </SlideshowContainer>
  );
};

export const query = graphql`
  query SlideQuery($slug: String!) {
    content: mdx(slug: { eq: $slug }) {
      frontmatter {
        nonInteractive
        title
        type
        content {
          title
          subtitle
          content
          image {
            publicURL
            childImageSharp {
              gatsbyImageData(placeholder: NONE)
            }
          }
          images {
            publicURL
            childImageSharp {
              gatsbyImageData(placeholder: NONE)
            }
          }
          inset
          fullscreen
          videoProperties {
            autoPlay
            controls
            muted
            loop
          }
          file {
            publicURL
            extension
          }
          answers {
            answer
            icon
          }
          question
          iconLife
          withGraphs
          smallIcons
        }
      }
      body
    }
  }
`;

export default SlideTemplate;
