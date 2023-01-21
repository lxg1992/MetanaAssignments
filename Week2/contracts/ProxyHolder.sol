// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Tokens
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
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

    function mint(address to, uint256 displayAmount) public {
        _mint(to, displayAmount * 10 ** decimals());
    }

    function selfMint(uint256 displayAmount) public {
        _mint(msg.sender, displayAmount * 10 ** decimals());
    }

    function approve(address spender, uint256 displayAmount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, displayAmount * 10 ** decimals());
        return true;
    }

    function adminTransfer(address from, address to, uint256 displayAmount) public {
        _transfer(from, to, displayAmount * 10 ** decimals());
    }
}

contract ProxyContract {
    ERC20Contract public token;
    ERC721Contract public nft;
    address public proxyAddress;

    mapping(uint256 => address) public originalOwner;

    mapping(address => uint256) public latestWithdrawTimer;
    mapping(address => uint256) public allowedWithdrawAmount;

    mapping(address => bool) public ownerHasStakedNFT;

    constructor(address erc20Addr, address erc721Addr) {
        token = ERC20Contract(erc20Addr);
        nft = ERC721Contract(erc721Addr);
        proxyAddress = address(this);
        token.selfMint(1000); // minting 1000 * 10 ** 18
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        originalOwner[tokenId] = from;
       return IERC721Receiver.onERC721Received.selector;
    }

    function proxyTokenMint(uint256 displayAmount) public {
        token.selfMint(displayAmount);
    }

    function depositNFT(uint256 tokenId) external {
        require(ownerHasStakedNFT[msg.sender] == false, "You already have a staked NFT, cannot have another");
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        ownerHasStakedNFT[msg.sender] = true;
        if (latestWithdrawTimer[msg.sender] <= block.timestamp) {
            latestWithdrawTimer[msg.sender] = block.timestamp + 1 days;
            allowedWithdrawAmount[msg.sender] = 10;
        }
    }

    function withdrawNFT(uint256 tokenId) external {
        require(originalOwner[tokenId] == msg.sender, "not original owner");
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        ownerHasStakedNFT[msg.sender] = false;
    }

    function withdrawTokens(uint256 displayAmount) external {
        require(ownerHasStakedNFT[msg.sender] == true, "Your NFT is not staked!");
        require(displayAmount <= allowedWithdrawAmount[msg.sender], "Exceeding your allowance to withdraw");
        require(token.balanceOf(address(this)) >= displayAmount * 10 ** token.decimals(), "Contract doesn't have enough tokens");
        if (block.timestamp > latestWithdrawTimer[msg.sender]) {
            latestWithdrawTimer[msg.sender] = block.timestamp + 1 days;
            allowedWithdrawAmount[msg.sender] = 10;
        }
        token.adminTransfer(address(this), msg.sender, displayAmount);
        allowedWithdrawAmount[msg.sender] -= displayAmount;
    }





    // Called by a user who wants to buy 10 tokens to mint
    // function proxyMint() public {
    //     address originalCaller = msg.sender;
    //     require(token.allowance(originalCaller, proxyAddress) >= 10 * 10 ** token.decimals(), "Need at least 10 tokens");
    //     bool sent = token.transferFrom(originalCaller, proxyAddress, 10 * 10 ** token.decimals());
    //     require(sent, "Token transfer failed");
    //     nft.mint(originalCaller);
    // }
}
