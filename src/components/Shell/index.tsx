import { graphql, PageProps, useStaticQuery } from "gatsby";
import React, { useEffect } from "react";

import "../../styles/globals.scss";
import { registerBootlegVH } from "../../utils/events";
import { UserContainer } from "../UserContext";

const Shell: React.FC<PageProps> = ({ children }) => {
  const data = useStaticQuery(graphql`
    query InfoQuery {
      site {
        siteMetadata {
          nonInteractive
        }
      }
    }
  `);

  useEffect(() => {
    registerBootlegVH();
  }, []);

  return (
    <UserContainer
      forceNonInteractive={data.site.siteMetadata.nonInteractive || false}
    >
      {children}
    </UserContainer>
  );
};

export { Shell };
