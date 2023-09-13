import React, { useEffect } from "react";
import { PageContextProvider } from "./usePageContext.js";
import type { PageContext } from "./types.js";
import "./PageShell.css";
import { MetaMaskProvider } from "metamask-react";
import { ChakraProvider } from "@chakra-ui/react";
import { Layout } from "../layout/Layout.js";
import { Navbar } from "../layout/Navbar.js";

export { PageShell };

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <ChakraProvider>
      <React.StrictMode>
        <MetaMaskProvider>
          <PageContextProvider pageContext={pageContext}>
            <Layout>
              <Navbar />
              <Content>{children}</Content>
            </Layout>
          </PageContextProvider>
        </MetaMaskProvider>
      </React.StrictMode>
    </ChakraProvider>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: "0 1% 0 10%",
        padding: 20,
        // paddingBottom: 50,
        border: "1px solid red",
        // minHeight: "80vh",
      }}
    >
      {children}
    </div>
  );
}
