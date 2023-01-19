// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MetanaNFT is ERC721, ERC721Holder {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;
    /// @dev Base token URI used as a prefix by tokenURI().
    string public baseTokenURI;

    uint256 public constant MAX_SUPPLY = 10;

    constructor() ERC721("MetaHouseNFT", "MN") {
        baseTokenURI = "";
    }

    function mint() public returns (uint256) {
        require(currentTokenId.current() < MAX_SUPPLY, "supply exceeded");
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(msg.sender, newItemId);
        return newItemId;
    }

    function mintTo(address recipient) public returns (uint256) {
        require(currentTokenId.current() < MAX_SUPPLY, "supply exceeded");
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(recipient, newItemId);
        return newItemId;
    }

    /// @dev Returns an URI for a given token ID
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    /// @dev Sets the base token URI prefix.
    function setBaseTokenURI(string memory _baseTokenURI) public {
        baseTokenURI = _baseTokenURI;
    }
}
