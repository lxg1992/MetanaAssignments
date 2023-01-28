require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  `${process.env.GOERLI_ENDPOINT}`
);
// const provider = new ethers.providers.JsonRpcProvider(
//   `${process.env.ETHEREUM_ENDPOINT}`
// );

const ERC20_ABI = [
  "function name() view returns(string)",
  "function symbol() view returns(string)",
  "function totalSupply() view returns(uint256)",
  "function balanceOf(address) view returns(uint)",
  "function transfer(address to, uint amount) returns(bool)",
];

const address1key = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(address1key, provider);

const address1 = "0x5BD00AB64cA841f01BEDee69d431be70169Cf744"; // Acc1
const address2 = "0xb96539EAc3304B804C653812268b2D935Eef0194";
const CLAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
const contract = new ethers.Contract(CLAddress, ERC20_ABI, provider);

const main = async () => {
  const balance = await contract.balanceOf(address1);
  const formattedBalance = ethers.utils.formatEther(balance);
  const contractWithWallet = contract.connect(wallet);
  console.log({ formattedBalance });
  // const tx = await contractWithWallet.transfer(address2, balance);
  // await tx.wait();
  // Send Ether
};

main().catch((e) => console.log(e));
