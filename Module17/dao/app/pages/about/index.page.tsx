import { useMetaMask } from "metamask-react";

export { Page };

function Page(pageProps) {
  console.log({ pageProps });
  return (
    <>
      <h1>About</h1>
      <p>
        Example of using <code>vite-plugin-ssr</code>.
      </p>
    </>
  );
}
