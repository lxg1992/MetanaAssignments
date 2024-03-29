// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSale is ERC20 {
    address payable private _centralAuthority;
    uint256 private immutable tokenDecimals;
    uint256 private immutable maxTokens;
    bool private saleIsClosed;

    constructor(address specialAddress) ERC20("MetanaToken", "MTK") {
        _centralAuthority = payable(specialAddress);
        tokenDecimals = 10**decimals();
        maxTokens = 1_000_000 * tokenDecimals;
        saleIsClosed = false;
    }

    modifier onlySpecialAddress() {
        require(
            msg.sender == _centralAuthority,
            "Only special address can modify data"
        );
        _;
    }

    // Explicit setting of decimals to 18, although it's 18 by default
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function buy(uint256 amount) public payable {
        require(!saleIsClosed, "Sorry, the sale is closed");
        if ((amount * tokenDecimals) + totalSupply() > maxTokens) {
            revert("Supply will exceed maximum");
        }
        _mint(msg.sender, amount * tokenDecimals);
        if (totalSupply() >= maxTokens) {
            saleIsClosed = true;
        }
    }

    function withdraw(address payable to) public onlySpecialAddress {
        uint256 amount = address(this).balance;
        // require(amount >= 1 ether, "Nothing to withdraw!");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to withdraw");
    }
}
