import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
}

const Markdown: React.FC<MarkdownProps> = ({ children, ...props }) => {
  return <ReactMarkdown children={children} remarkPlugins={[gfm]} {...props} />;
};

export { Markdown };
