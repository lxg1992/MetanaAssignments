const { AutotaskClient } = require("defender-autotask-client");
const { readFileSync, appendFileSync } = require("fs");

async function main() {
  require("dotenv").config();
  const {
    relayer: { relayerId },
  } = JSON.parse(readFileSync("./relay.json"));
  const { TEAM_API_KEY: apiKey, TEAM_API_SECRET: apiSecret } = process.env;
  const client = new AutotaskClient({ apiKey, apiSecret });
  const at = await client.create({
    name: "Relay MetaTX",
    encodedZippedCode: await client.getEncodedZippedCodeFromFolder(
      "./build/relay"
    ),
    relayerId: relayerId,
    trigger: {
      type: "webhook",
    },
    paused: false,
  });
  appendFileSync(".env", `\nAUTOTASK_ID="${at.autotaskId}"`, function (err) {
    if (err) throw err;
  });
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
