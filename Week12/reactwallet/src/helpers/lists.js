import { apiKey, chainScan } from "./constants.mjs";

// export const networks = ["mainnet", "goerli", "sepolia"];

export const networkDict = {
  mainnet: {
    name: "mainnet",
    title: "Mainnet",
    color: "red",
    node: `https://mainnet.infura.io/v3/${apiKey}`,
    chainScan: `https://etherscan.io`,
    label: "🟥",
  },
  goerli: {
    name: "goerli",
    title: "Goerli",
    color: "blue",
    node: `https://goerli.infura.io/v3/${apiKey}`,
    chainScan: `https://goerli.etherscan.io`,
    label: "🟦",
  },
  sepolia: {
    name: "sepolia",
    title: "Sepolia",
    color: "purple",
    node: `https://sepolia.infura.io/v3/${apiKey}`,
    chainScan: `https://sepolia.etherscan.io`,
    label: "🟪",
  },
};
