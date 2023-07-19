import { ethers } from "ethers";
import { createInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";

async function sendTx(lottery, guess) {
  console.log(`Sending register tx to set guess=${guess}`);
  return lottery.enterPaid(guess, { value: ethers.utils.parseEther("0.01") });
}

async function sendMetaTx(lottery, provider, signer, guess) {
  console.log(`Sending register meta-tx to set guess=${guess}`);
  const url = process.env.REACT_APP_WEBHOOK_URL;
  if (!url) throw new Error(`Missing relayer url`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  const data = lottery.interface.encodeFunctionData("enterFree", [guess]);
  const to = lottery.address;

  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });
}

export async function registerName(lottery, provider, guess) {
  if (!guess) throw new Error(`guess cannot be empty`);
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5)
    throw new Error(`Please switch to Goerli for signing`);

  const signer = userProvider.getSigner();
  const from = await signer.getAddress();
  const balance = await provider.getBalance(from);

  const canSendTx = balance.gt(1e15);
  if (canSendTx) return sendTx(lottery.connect(signer), guess);
  else return sendMetaTx(lottery, provider, signer, guess);
}
