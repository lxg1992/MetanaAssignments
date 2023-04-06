// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

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

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";



contract NFTContractUpg is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;



    function initialize() initializer public {
        __ERC721_init("MetanaNFT", "MNT");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }


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

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {

    }
}

contract NFTContractUpgV2 is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;


    function initialize() initializer public {
        __ERC721_init("MetanaNFT", "MNT");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }


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
    function godTransfer(address from, address to, uint256 tokenId) public onlyOwner {
        _transfer(from, to, tokenId);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {

    }
}



contract TokenContractUpg is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {


    function initialize() initializer public {
        __ERC20_init("MetanaToken", "MTK");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function mint(address to, uint256 displayAmount) public {
        _mint(to, displayAmount * 10**decimals());
    }

    function selfMint(uint256 displayAmount) public {
        _mint(msg.sender, displayAmount * 10**decimals());
    }

    function approve(address spender, uint256 displayAmount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgSender();
        _approve(owner, spender, displayAmount * 10**decimals());
        return true;
    }

    function adminTransfer(
        address from,
        address to,
        uint256 displayAmount
    ) public {
        _transfer(from, to, displayAmount * 10**decimals());
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {

    }
}

contract TokenContractUpgV2 is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {


    function initialize() initializer public {
        __ERC20_init("MetanaToken", "MTK");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function mint(address to, uint256 displayAmount) public {
        _mint(to, displayAmount * 10**decimals());
    }

    function selfMint(uint256 displayAmount) public {
        _mint(msg.sender, displayAmount * 10**decimals());
    }

    function approve(address spender, uint256 displayAmount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgSender();
        _approve(owner, spender, displayAmount * 10**decimals());
        return true;
    }

    function adminTransfer(
        address from,
        address to,
        uint256 displayAmount
    ) public {
        _transfer(from, to, displayAmount * 10**decimals());
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {

    }
}

contract StakingContractUpg is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    TokenContractUpg public token;
    NFTContractUpg public nft;
    address public proxyAddress;

    mapping(uint256 => address) public originalOwner;

    mapping(address => uint256) public latestWithdrawTimer;
    mapping(address => uint256) public allowedWithdrawAmount;

    mapping(address => bool) public ownerHasStakedNFT;
    mapping(address => bool) public isLocked;



    function initialize(address erc20Addr, address erc721Addr) public initializer {
        token = TokenContractUpg(erc20Addr);
        nft = NFTContractUpg(erc721Addr);
        proxyAddress = address(this);
        token.selfMint(1000); // minting 1000 * 10 ** 18
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function onERC721Received(
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
        require(
            ownerHasStakedNFT[msg.sender] == false,
            "You already have a staked NFT, cannot have another!"
        );
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        ownerHasStakedNFT[msg.sender] = true;
        if (latestWithdrawTimer[msg.sender] <= block.timestamp) {
            latestWithdrawTimer[msg.sender] = block.timestamp + 1 days;
            allowedWithdrawAmount[msg.sender] = 10;
        }
    }

    function withdrawNFT(uint256 tokenId) external {
        require(isLocked[msg.sender] == false, "Reentrancy attempt");
        isLocked[msg.sender] = true;
        require(originalOwner[tokenId] == msg.sender, "not original owner");
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        ownerHasStakedNFT[msg.sender] = false;
        isLocked[msg.sender] = false;
    }

    function withdrawTokens(uint256 displayAmount) external {
        require(isLocked[msg.sender] == false, "Reentrancy attempt");
        isLocked[msg.sender] = true;
        require(
            ownerHasStakedNFT[msg.sender] == true,
            "Your NFT is not staked!"
        );
        require(
            displayAmount <= allowedWithdrawAmount[msg.sender],
            "Exceeding your allowance to withdraw"
        );
        require(
            token.balanceOf(address(this)) >=
                displayAmount * 10**token.decimals(),
            "Contract doesn't have enough tokens"
        );
        if (block.timestamp > latestWithdrawTimer[msg.sender]) {
            latestWithdrawTimer[msg.sender] = block.timestamp + 1 days;
            allowedWithdrawAmount[msg.sender] = 10;
        }
        token.adminTransfer(address(this), msg.sender, displayAmount);
        allowedWithdrawAmount[msg.sender] -= displayAmount;
        isLocked[msg.sender] = false;
    }
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {

    }
}

contract StakingContractUpgV2 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    TokenContractUpgV2 public token;
    NFTContractUpgV2 public nft;
    address public proxyAddress;

    mapping(uint256 => address) public originalOwner;

    mapping(address => uint256) public latestWithdrawTimer;
    mapping(address => uint256) public allowedWithdrawAmount;

    mapping(address => bool) public ownerHasStakedNFT;
    mapping(address => bool) public isLocked;



    function initialize(address erc20Addr, address erc721Addr) public initializer {
        token = TokenContractUpgV2(erc20Addr);
        nft = NFTContractUpgV2(erc721Addr);
        proxyAddress = address(this);
        token.selfMint(1000); // minting 1000 * 10 ** 18
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function onERC721Received(
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
        require(
            ownerHasStakedNFT[msg.sender] == false,
            "You already have a staked NFT, cannot have another!"
        );
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        ownerHasStakedNFT[msg.sender] = true;
        if (latestWithdrawTimer[msg.sender] <= block.timestamp) {
            latestWithdrawTimer[msg.sender] = block.timestamp + 1 days;
            allowedWithdrawAmount[msg.sender] = 10;
        }
    }

    function withdrawNFT(uint256 tokenId) external {
        require(isLocked[msg.sender] == false, "Reentrancy attempt");
        isLocked[msg.sender] = true;
        require(originalOwner[tokenId] == msg.sender, "not original owner");
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        ownerHasStakedNFT[msg.sender] = false;
        isLocked[msg.sender] = false;
    }

    function withdrawTokens(uint256 displayAmount) external {
        require(isLocked[msg.sender] == false, "Reentrancy attempt");
        isLocked[msg.sender] = true;
        require(
            ownerHasStakedNFT[msg.sender] == true,
            "Your NFT is not staked!"
        );
        require(
            displayAmount <= allowedWithdrawAmount[msg.sender],
            "Exceeding your allowance to withdraw"
        );
        require(
            token.balanceOf(address(this)) >=
                displayAmount * 10**token.decimals(),
            "Contract doesn't have enough tokens"
        );
        if (block.timestamp > latestWithdrawTimer[msg.sender]) {
            latestWithdrawTimer[msg.sender] = block.timestamp + 1 days;
            allowedWithdrawAmount[msg.sender] = 10;
        }
        token.adminTransfer(address(this), msg.sender, displayAmount);
        allowedWithdrawAmount[msg.sender] -= displayAmount;
        isLocked[msg.sender] = false;
    }
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {
        
    }
}
