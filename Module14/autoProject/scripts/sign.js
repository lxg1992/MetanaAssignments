const { ethers } = require("hardhat");
const { signMetaTxRequest } = require("../src/signer");
const { readFileSync, writeFileSync } = require("fs");

const DEFAULT_GUESS = 55;

function getInstance(name) {
  const address = JSON.parse(readFileSync("deploy.json"))[name];
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`);
  return ethers.getContractFactory(name).then((f) => f.attach(address));
}

async function main() {
  const forwarder = await getInstance("MinimalForwarder");
  const lottery = await getInstance("AutoLottery");

  const { GUESS: guess, PRIVATE_KEY: signer } = process.env;
  const from = new ethers.Wallet(signer).address;
  console.log(`Signing guess of ${guess || DEFAULT_GUESS} as ${from}...`);
  const data = lottery.interface.encodeFunctionData("enterFree", [
    guess || DEFAULT_GUESS,
  ]);
  const result = await signMetaTxRequest(signer, forwarder, {
    to: lottery.address,
    from,
    data,
  });

  writeFileSync(
    __dirname + "/tmp/request.json",
    JSON.stringify(result, null, 2)
  );
  console.log(`Signature: `, result.signature);
  console.log(`Request: `, result.request);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
