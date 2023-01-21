// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Interfaces
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
// Utils
import "@openzeppelin/contracts/utils/Counters.sol";
// Access
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Contract is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    constructor() ERC721("MetanaNFT", "MTK") {}

    function mint(address _to) public returns (uint256) {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(_to, newItemId);
        return newItemId;
    }

    function selfMint() public returns (uint256) {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(msg.sender, newItemId);
        return newItemId;
    }
}

contract ERC20Contract is ERC20, Ownable {
    constructor() ERC20("MetanaToken", "MTK") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount * 10**decimals());
    }

    function selfMint(uint256 amount) public {
        _mint(msg.sender, amount * 10**decimals());
    }

    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address tokenOwner = _msgSender();
        _approve(tokenOwner, spender, amount * 10**decimals());
        return true;
    }
}

contract ProxyMinter {
    ERC20Contract public token;
    ERC721Contract public nft;
    address public proxyAddress;

    constructor(address erc20Addr, address erc721Addr) {
        token = ERC20Contract(erc20Addr);
        nft = ERC721Contract(erc721Addr);
        proxyAddress = address(this);
    }

    // Called by a user who wants to buy 10 tokens to mint
    function proxyMint() public {
        address originalCaller = msg.sender;
        require(
            token.allowance(originalCaller, proxyAddress) >=
                10 * 10**token.decimals(),
            "Need at least 10 tokens"
        );
        bool sent = token.transferFrom(
            originalCaller,
            proxyAddress,
            10 * 10**token.decimals()
        );
        require(sent, "Token transfer failed");
        nft.mint(originalCaller);
    }
}
