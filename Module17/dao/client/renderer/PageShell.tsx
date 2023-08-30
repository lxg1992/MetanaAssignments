import React from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";
import { Link } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";

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
        <PageContextProvider pageContext={pageContext}>
          <Layout>
            <Navbar>
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
            </Navbar>
            <Content>{children}</Content>
          </Layout>
        </PageContextProvider>
      </React.StrictMode>
    </ChakraProvider>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px dotted blue",
      }}
    >
      {children}
    </div>
  );
}

function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: "1px dashed cyan",
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 800,
        marginLeft: "10%",
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
