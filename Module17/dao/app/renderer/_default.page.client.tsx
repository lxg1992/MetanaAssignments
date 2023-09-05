export { render };

import { hydrateRoot } from "react-dom/client";
import { PageShell } from "./PageShell.js";
import type { PageContextClient } from "./types.js";
import { ethers } from "ethers";

// This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;
  if (!Page)
    throw new Error(
      "Client-side render() hook expects pageContext.Page to be defined"
    );

  let signer: ethers.Signer | undefined;
  let address: string | undefined;
  let provider: ethers.providers.Web3Provider | undefined;

  if (typeof window !== "undefined" && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    address = await signer.getAddress();
  }
  const root = document.getElementById("react-root");
  if (!root) throw new Error("DOM element #react-root not found");
  hydrateRoot(
    root,
    <PageShell pageContext={{ ...pageContext }}>
      <Page {...pageProps} />
    </PageShell>
  );
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
