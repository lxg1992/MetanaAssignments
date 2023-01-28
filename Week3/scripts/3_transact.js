require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  `${process.env.GOERLI_ENDPOINT}`
);
// const provider = new ethers.providers.JsonRpcProvider(
//   `${process.env.ETHEREUM_ENDPOINT}`
// );

const address1 = "0x5BD00AB64cA841f01BEDee69d431be70169Cf744"; // Acc1
const address2 = "0xb96539EAc3304B804C653812268b2D935Eef0194";
const address1key = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(address1key, provider);

const main = async () => {
  //Send Ether
  const senderBal = provider.getBalance(address1);
  const recBal = provider.getBalance(address2);
  
  const tx = await wallet.sendTransaction({
    to: address2,
    value: ethers.utils.parseEther("0.01"),
  });
  console.log({ tx });

  await tx.wait();
  console.log({ txCompleted: tx });
};

main().catch((e) => console.log(e));
