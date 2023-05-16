// const fetch = require("node-fetch");

const { utils } = require("ethers");
// // Infura endpoint for Ethereum mainnet
// const endpoint = "https://goerli.infura.io/v3/3f603564d9e44bcd91f5d08319d99942";

// // JSON-RPC request to get the latest block number
// const blockNumberRequest = {
//   jsonrpc: "2.0",
//   id: 1,
//   method: "eth_blockNumber",
//   params: [],
// };

// // JSON-RPC request to get the gas price for a block
// function getBlockGasPriceRequest(blockNumber) {
//   return {
//     jsonrpc: "2.0",
//     id: 2,
//     method: "eth_getBlockByNumber",
//     params: [blockNumber, false],
//   };
// }

const transferSignature = "0xa9059cbb";

// // Convert hex string to decimal
// function hexToDecimal(hexString) {
//   return parseInt(hexString, 16);
// }

// // Fetch the latest block and log its gas price
// fetch(endpoint, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(blockNumberRequest),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     const latestBlockNumber = hexToDecimal(data.result);
//     return fetch(endpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(
//         getBlockGasPriceRequest(`0x${latestBlockNumber.toString(16)}`)
//       ),
//     });
//   })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data.result.baseFeePerGas);
//     const gasPriceWei = hexToDecimal(data.result.gasPrice);
//     const gasPriceGwei = gasPriceWei / 1e9;
//     console.log(`Gas price for latest block: ${gasPriceGwei} Gwei`);
//   })
//   .catch((error) => console.error(error));
