import {
  Transfer as TransferEvent,
  BAYC as TokenContract,
} from "../generated/BAYC/BAYC";

import { Token, User } from "../generated/schema";

import { ipfs, json } from "@graphprotocol/graph-ts";

const ipfshash = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.params.tokenId.toString());

  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.tokenID = event.params.tokenId;
    token.tokenURI = "/" + event.params.tokenId.toString() + ".json";

    let metadata = ipfs.cat(ipfshash + token.tokenURI);

    if (metadata) {
      const value = json.fromBytes(metadata).toObject();
      if (value) {
        const image = value.get("image");
        const name = value.get("name");
        // const description = value.get("description");
        // const externalURL = value.get("external_url");
        if (name && image) {
          token.image = image.toString();
          token.name = name.toString();
          //   token.externalURL = externalURL.toString();
          //   token.description = description.toString();
          token.ipfsURI = "ipfs.io/ipfs/" + ipfshash + token.tokenURI;
        }
      }
    }
    token.updatedAtTimestamp = event.block.timestamp;
    token.owner = event.params.to.toHexString();
    token.save();

    let user = User.load(event.params.to.toHexString());
    if (!user) {
      user = new User(event.params.to.toHexString());
      user.save();
    }
  }
}
