const Web3 = require("web3");
const { pk: pk1 } = require("./constants");

// Provider
const web3 = new Web3(
  "https://mainnet.infura.io/v3/3f603564d9e44bcd91f5d08319d99942"
);

// Address and Private Key
const address = "0x5BD00AB64cA841f01BEDee69d431be70169Cf744";
// const pk1 = "99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342";
const msg = web3.utils.sha3("interesting");

async function signMessage(pk) {
  try {
    // Sign and get Signed Message
    const smsg = await web3.eth.accounts.sign(msg, pk);
    console.log(smsg);
  } catch (error) {
    console.error(error);
  }
}

signMessage(pk1);
