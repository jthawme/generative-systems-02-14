import React from "react";
import { Shell } from "./src/components/Shell";

export const wrapPageElement = ({ element, props }) => (
  <Shell {...props}>{element}</Shell>
);
