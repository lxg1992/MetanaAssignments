require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  `${process.env.GOERLI_ENDPOINT}`
);
// ethers.providers.JsonRpcProvider(`${process.env.ETHEREUM_ENDPOINT}`);
const main = async () => {
    const balance = await provider.getBalance();
    console.log(`ETH Balance of ${address}`)

};

main().catch((e) => console.log(e));
