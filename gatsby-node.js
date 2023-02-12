const path = require("path");
const fs = require("fs");
const { createFilePath } = require("gatsby-source-filesystem");

let slideOrders = [];

const getNextSlideOrder = (num, iteration = 0) => {
  const test = iteration === 0 ? num : `${num}-${iteration}`;

  if (slideOrders.includes(test)) {
    return getNextSlideOrder(num, iteration + 1);
  }

  return test;
};
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    if (node.fileAbsolutePath.includes("/slides/")) {
      const next =
        typeof node.frontmatter.order !== "undefined"
          ? parseInt(node.frontmatter.order)
          : slideOrders.length;
      // const slug = node.slug.split('/').join('-');

      // console.log(node);
      const slug = getNextSlideOrder(next);
      slideOrders.push(slug);

      createNodeField({
        name: `order`,
        node,
        value: next,
      });
      // createNodeField({
      //   name: `slug`,
      //   node,
      //   value: slug.toString()
      // });
    }
  }
};

exports.onCreatePage = async ({ page, cache, actions: { deletePage } }) => {
  const nonInteractive = await cache.get("noninteractive");

  if (page.path === "/" && nonInteractive) {
    deletePage(page);
  }
};

exports.createPages = async ({ graphql, cache, actions }) => {
  const { createPage, createRedirect } = actions;

  const result = await graphql(`
    query {
      site {
        siteMetadata {
          nonInteractive
        }
      }
      firstSlide: mdx(frontmatter: { order: { eq: 0 } }) {
        slug
      }
      slides: allMdx(filter: { fileAbsolutePath: { regex: "/(/slides/)/" } }) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);

  await cache.set(
    "noninteractive",
    result.data.site.siteMetadata.nonInteractive,
  );
  if (result.data.site.siteMetadata.nonInteractive) {
    const firstNode = result.data.firstSlide;

    const firstSlug =
      firstNode.slug.charAt(firstNode.slug.length - 1) == "/"
        ? firstNode.slug.substr(0, firstNode.slug.length - 1)
        : firstNode.slug;

    createRedirect({
      fromPath: `/`,
      toPath: `/slide/${firstSlug}/`,
      redirectInBrowser: true,
      isPermanent: true,
    });
  }

  result.data.slides.edges.forEach(({ node }) => {
    const slug =
      node.slug.charAt(node.slug.length - 1) == "/"
        ? node.slug.substr(0, node.slug.length - 1)
        : node.slug;
    createPage({
      path: `/slide/${slug}`,
      component: path.resolve(`./src/templates/slide.tsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.slug,
      },
    });
  });
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const typeDefs = `
    type MdxFrontmatter implements Node {
      nonInteractive: Boolean
    }
    
    type MdxFrontmatterContent implements Node {
      inset: Boolean
      fullscreen: Boolean
      videoProperties: MdxFrontmatterContentVideoProperties
      answers: [MdxFrontmatterContentAnswer!]
      question: String
      iconLife: Int
      smallIcons: Boolean
      withGraphs: Boolean
      title: String
      subtitle: String
      file: File @fileByRelativePath
    }

    type MdxFrontmatterContentVideoProperties {
      autoPlay: Boolean
      muted: Boolean
      controls: Boolean
      loop: Boolean
    }

    type MdxFrontmatterContentAnswer {
      answer: String!
      icon: String
    }
  `;
  actions.createTypes(typeDefs);
};
