export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "urlPathname"];

import ReactDOMServer from "react-dom/server";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import type { PageContextServer } from "./types";

export { onBeforeRender };
async function onBeforeRender(pageContext: PageContextServer) {
  const mode = import.meta.env.NETWORK_MODE || "hardhat";
  const governanceToken = await import(
    `../ethereum/${mode}/GovernanceToken.json`
  );
  const governorContract = await import(
    `../ethereum/${mode}/GovernorContract.json`
  );
  const timeLock = await import(`../ethereum/${mode}/TimeLock.json`);
  const box = await import(`../ethereum/${mode}/Box.json`);

  const pageProps = {
    governanceToken,
    governorContract,
    timeLock,
    box,
    mode,
  };

  return {
    pageContext: {
      pageContext,
      pageProps,
    },
  };
}

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;
  // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
  if (!Page)
    throw new Error("My render() hook expects pageContext.Page to be defined");
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || "Vite SSR app";
  const desc =
    (documentProps && documentProps.description) ||
    "App using Vite + vite-plugin-ssr";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      Page,
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
