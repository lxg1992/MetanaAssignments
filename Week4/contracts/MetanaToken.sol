// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract MetanaMultiToken is ERC1155, Ownable {
    mapping(address => bool) public isSpecial;

    // // Base Tokens
    // uint256 public constant token0b = 0;
    // uint256 public constant token1b = 1;
    // uint256 public constant token2b = 2;

    // // Improved Tokens
    // uint256 public constant token3i = 3;
    // uint256 public constant token4i = 4;
    // uint256 public constant token5i = 5;

    // // Supreme Token
    // uint256 public constant token6s = 6;

    constructor() ERC1155("") {
        setSpecialAccess(msg.sender, true);
    }

    modifier onlySpecial() {
        require(isSpecial[msg.sender] == true, "Has not special privileges");
        _;
    }

    function setSpecialAccess(address to, bool access) public onlyOwner {
        isSpecial[to] = access;
    }

    function getSpecialAccess(address addr) public view returns (bool) {
        return isSpecial[addr];
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlySpecial {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlySpecial {
        _mintBatch(to, ids, amounts, data);
    }

    function burn(
        address from,
        uint256 id,
        uint256 amount
    ) public onlySpecial {
        _burn(from, id, amount);
    }

    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public onlySpecial {
        _burnBatch(from, ids, amounts);
    }
}

contract Forger {
    MetanaMultiToken private mmToken;

    mapping(address => uint256) private timeoutExpires;
    mapping(uint256 => bool) private isBuyable;

    constructor(address _address) {
        mmToken = MetanaMultiToken(_address);
        isBuyable[0] = true;
        isBuyable[1] = true;
        isBuyable[2] = true;
    }

    function getTokenBalance(address _addr, uint256 tokenId)
        public
        view
        returns (uint256)
    {
        return mmToken.balanceOf(_addr, tokenId);
    }

    function forge(uint256 tokenId, uint256 amount) public {
        require(
            block.timestamp >= timeoutExpires[msg.sender],
            "Need to wait at least a minute between transactions"
        );
        timeoutExpires[msg.sender] = block.timestamp + 1 minutes;
        if (tokenId == 0 || tokenId == 1 || tokenId == 2) {
            mmToken.mint(msg.sender, tokenId, amount, "");
        } else if (tokenId == 3 || tokenId == 4 || tokenId == 5) {
            forgeImproved(tokenId, amount);
        } else if (tokenId == 6) {
            forgeSupreme(amount);
        }
    }

    function forgeImproved(uint256 tokenId, uint256 amount) internal {
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amount;
        amounts[1] = amount;
        uint256[] memory ids = new uint256[](2);
        if (tokenId == 3) {
            require(
                mmToken.balanceOf(msg.sender, 0) >= amount,
                "Not enough tokens of id 0"
            );
            require(
                mmToken.balanceOf(msg.sender, 1) >= amount,
                "Not enough tokens of id 1"
            );
            ids[0] = 0;
            ids[1] = 1;
            mmToken.burnBatch(msg.sender, ids, amounts);
            mmToken.mint(msg.sender, tokenId, amount, "");
        } else if (tokenId == 4) {
            require(
                mmToken.balanceOf(msg.sender, 1) >= amount,
                "Not enough tokens of id 1"
            );
            require(
                mmToken.balanceOf(msg.sender, 2) >= amount,
                "Not enough tokens of id 2"
            );
            ids[0] = 1;
            ids[1] = 2;
            mmToken.burnBatch(msg.sender, ids, amounts);
            mmToken.mint(msg.sender, tokenId, amount, "");
        } else if (tokenId == 5) {
            require(
                mmToken.balanceOf(msg.sender, 0) >= amount,
                "Not enough tokens of id 0"
            );
            require(
                mmToken.balanceOf(msg.sender, 2) >= amount,
                "Not enough tokens of id 2"
            );
            ids[0] = 0;
            ids[1] = 2;
            mmToken.burnBatch(msg.sender, ids, amounts);
            mmToken.mint(msg.sender, tokenId, amount, "");
        }
    }

    function forgeSupreme(uint256 amount) internal {
        require(
            mmToken.balanceOf(msg.sender, 0) >= amount,
            "Not enough tokens of id 0"
        );
        require(
            mmToken.balanceOf(msg.sender, 1) >= amount,
            "Not enough tokens of id 1"
        );
        require(
            mmToken.balanceOf(msg.sender, 2) >= amount,
            "Not enough tokens of id 2"
        );
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = amount;
        amounts[1] = amount;
        amounts[2] = amount;
        uint256[] memory ids = new uint256[](3);
        ids[0] = 0;
        ids[1] = 1;
        ids[2] = 2;
        mmToken.burnBatch(msg.sender, ids, amounts);
        mmToken.mint(msg.sender, 6, amount, "");
    }

    function tradeFrom(
        uint256 fromToken,
        uint256 toToken,
        uint256 amount
    ) public {
        require(isBuyable[toToken] == true, "Cannot trade for this token");
        mmToken.burn(msg.sender, fromToken, amount);
        mmToken.mint(msg.sender, toToken, amount, "");
    }
}
