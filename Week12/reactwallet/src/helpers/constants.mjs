export const apiKey = process.env.API_KEY || "3f603564d9e44bcd91f5d08319d99942";

export const pKeyRegex = /[0-9a-f]{64}/i;

export const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

export const hexaDecimalRegex = /^0x[a-fA-F0-9]+$/;

export const generateDefaultAccount = ({
  publicKey = "",
  ethAddress = "",
  encPK = "",
  salt = "",
  isSet = false,
  fromMnemonic = false,
  encMnemonic = "",
}) => {
  return {
    isSet,
    publicKey,
    encPK,
    salt,
    address: ethAddress,
    lastTx: "",
    fromMnemonic,
    encMnemonic,
    ERC20Contracts: {
      mainnet: {},
      sepolia: {},
      goerli: {
        USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", //goerli
        CHAINLINK: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB", //goerli
      },
    },
  };
};
