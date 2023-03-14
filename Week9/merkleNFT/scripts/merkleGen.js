const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const hre = require("hardhat");

function hashToken(idx, account) {
  return Buffer.from(
    hre.ethers.utils
      .solidityKeccak256(["uint256", "address"], [idx, account])
      .slice(2),
    "hex"
  );
}
const ids = {
  "0x70a85c13Ca3c79C5d5e0452Da91A6E64f8c7Db80": 0,
  "0xbc190065f7CDb10C970CBF57cB24401c4c86d4CC": 1,
  "0xf10c2Fbc92BC4490aec8D93859762f10E6893884": 2,
  //   "0x1116793a28Cbdfa5182f24366fFCbbbC3094CF40": 3,
  //   "0x667F1F3947e152C0d517Fd0D2a0E81dd9390FEdD": 4,
  //   "0xeBB35336d5bA07C788973D6f8C8496E5bA779840": 5,
  //   "0xC3f753A136EF893a24972635a4cA29EFAaA94729": 6,
  //   "0x6990f0AC60f306A630EA2CD4BcB868119E4B7353": 7,
  //   "0x1591E22EBF19bFcd234FC04cdA03E41d6Dc963B0": 8,
  //   "0xFe0985F3e4175487fB948A906867EbE9f307c6E4": 9,
};
const leafs = Object.entries(ids).map((token) => {
  console.log({ token });
  return hashToken(...token);
});
const merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
const root = merkleTree.getHexRoot();
console.log({ root });
const proof0 = merkleTree.getHexProof(hashToken(...Object.entries(ids)[0]));
const proof1 = merkleTree.getHexProof(hashToken(...Object.entries(ids)[1]));
const proof2 = merkleTree.getHexProof(hashToken(...Object.entries(ids)[2]));
console.log({ proof0 });
console.log({ proof1 });
console.log({ proof2 });
