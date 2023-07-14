const { ethers } = require("hardhat");
const { readFileSync } = require("fs");

function getInstance(name) {
  const address = JSON.parse(readFileSync("deploy.json"))[name];
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`);
  return ethers.getContractFactory(name).then((f) => f.attach(address));
}

async function main() {
  const lottery = await getInstance("AutoLottery");
  const events = await lottery.queryFilter(lottery.filters.Entered());
  console.log("Entries");
  console.log("=============");
  console.log(
    events
      .map(
        (e) =>
          `[${e.blockNumber}] https://goerli.etherscan.io/address/${e.args.who} => ${e.args.guess}`
      )
      .join("\n")
  );
  console.log();
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
