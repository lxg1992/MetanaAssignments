export const apiKey = process.env.API_KEY || "3f603564d9e44bcd91f5d08319d99942";

export const pKeyRegex = /[0-9a-f]{64}/i;

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
      goerli: {},
    },
  };
};
