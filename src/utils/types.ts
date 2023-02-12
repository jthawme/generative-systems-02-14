import { IGatsbyImageData } from "gatsby-plugin-image";
import { VideoHTMLAttributes } from "react";

export enum SlideType {
  Title = "title",
  Image = "image",
  File = "file",
  MDX = "mdx",
  Poll = "poll",
  Content = "content",
}

interface SlideCommon {
  title?: string;
  nonInteractive?: boolean;
}

type ImageBlock = {
  publicURL: string;
  childImageSharp?: {
    gatsbyImageData: IGatsbyImageData;
  };
};

export interface SlideTitleType extends SlideCommon {
  type: SlideType.Title;
  content: {
    title: string;
    subtitle?: string;
    image?: ImageBlock;
  };
}

export interface SlideContentType extends SlideCommon {
  type: SlideType.Content;
  content: {
    title: string;
    content?: string;
  };
}

export interface SlideImageType extends SlideCommon {
  type: SlideType.Image;
  content: {
    image?: ImageBlock;
    images?: ImageBlock[];
    inset?: boolean;
    speed?: number;
  };
}

export interface SlideFileType extends SlideCommon {
  type: SlideType.File;
  content: {
    file: {
      publicURL: string;
      extension: string;
    };
    videoProperties?: VideoHTMLAttributes<HTMLVideoElement>;
    inset?: boolean;
  };
}

export interface SlideMDXType extends SlideCommon {
  type: SlideType.MDX;
  content: {
    fullscreen?: boolean;
  };
  body: string;
}

export interface SlidePollQuestion {
  answer: string;
  icon?: string;
}

export interface SlidePollType extends SlideCommon {
  type: SlideType.Poll;
  content: {
    answers: SlidePollQuestion[];
    question: string;
    iconLife?: number;
    withGraphs?: boolean;
    smallIcons?: boolean;
  };
}

export type Slides =
  | SlideTitleType
  | SlideContentType
  | SlideImageType
  | SlideFileType
  | SlideMDXType
  | SlidePollType;
