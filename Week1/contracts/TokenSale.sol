// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSale is ERC20 {
    address payable private _centralAuthority;
    uint64 private tokenDecimals = 10 ** 18;
    uint80 private maxTokens = 1_000_000 * tokenDecimals;
    bool private saleIsClosed = false;
    
    constructor(address specialAddress) ERC20("MetanaToken", "MTK") {
        _centralAuthority = payable(specialAddress);
    }

    modifier onlySpecialAddress {
        require(msg.sender == _centralAuthority, "Only special address can modify data");
        _;
    }

    // Explicit setting of decimals to 18, although it's 18 by default
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function mint1000() public payable {
        require(msg.value == 1 ether, "Value must be 1 ether");
        require(!saleIsClosed, "Sorry, the sale is closed");
        _mint(msg.sender, 1000 * tokenDecimals);
        if (totalSupply() >= maxTokens) {
            saleIsClosed = true;
        }
    }

    function withdraw(address payable to) public onlySpecialAddress{
        uint amount = address(this).balance;
        require(amount >= 1 ether, "Nothing to withdraw!");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to withdraw");
    }

    


}