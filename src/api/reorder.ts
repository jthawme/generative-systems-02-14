import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default async function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse,
) {
  const slidesPath = path.join(__dirname, "../../src/slides");
  const slidesDir = fs.readdirSync(slidesPath);

  const newOrder = req.body;

  newOrder.sort((a, b) => {
    if (b.order - a.order > 0) {
      return -1;
    }
    if (b.order - a.order < 0) {
      return 1;
    }
    return 0;
  });

  newOrder.forEach((order) => {
    let target = `${order.slug}.mdx`;

    if (order.slug.charAt(order.slug.length - 1) === "/") {
      target = `${order.slug}index.mdx`;
    }

    const contents = fs.readFileSync(path.join(slidesPath, target), "utf-8");
    const fileData = matter(contents);
    fileData.data.order = order.order;

    fs.writeFileSync(
      path.join(slidesPath, target),
      fileData.stringify(""),
      "utf-8",
    );
  });

  res.status(200).json({ hello: `world` });
}
