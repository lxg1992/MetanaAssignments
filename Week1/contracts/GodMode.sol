// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GodMode is ERC20 {
    address private _specialAddress;
    
    constructor(address specialAddress) ERC20("MetanaToken", "MTK") {
        _specialAddress = specialAddress;
    }

    modifier onlySpecialAddress {
        require(msg.sender == _specialAddress, "Only special address can modify data");
        _;
    }

    function mintTokensToAddress(address to, uint256 amount) public onlySpecialAddress {
        _mint(to, amount);
    }

    function changeBalanceAtAddress(address target, uint256 newBalance) public onlySpecialAddress {
        // since the _balances mapping of the ERC20 parent contract is private
        // we have to 
        uint256 currentBalance = balanceOf(target);
        if (currentBalance < newBalance) {
            _mint(target, newBalance - currentBalance);
        } else if (currentBalance > newBalance) {
            _burn(target, currentBalance - newBalance);
        } //else if newBalance is same as before, do nothing
    }

    function authoritativeTransferFrom(address from, address to, uint256 amount) public onlySpecialAddress {
        _transfer(from, to, amount);
    }
}