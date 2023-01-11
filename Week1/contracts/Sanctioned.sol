// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Sanctioned is ERC20 {
    address private _centralAuthority;
    mapping(address => bool) private blacklisted;
    
    constructor(address specialAddress) ERC20("MetanaToken", "MTK") {
        _centralAuthority = specialAddress;
    }

    modifier onlySpecialAddress {
        require(msg.sender == _centralAuthority, "Only special address can modify data");
        _;
    }

    function setAddressBlacklistStatus(address target, bool status) public onlySpecialAddress {
        blacklisted[target] = status;
    }

    function getAddressBlacklistStatus(address target) public view returns (bool) {
        return blacklisted[target];
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        require(blacklisted[from] == false, "Address is blacklisted(from)");
        require(blacklisted[to] == false, "Address is blacklisted(to)");
        super._beforeTokenTransfer(from, to, amount);
    }

        // function mintTokensToAddress(address to, uint256 amount) public onlySpecialAddress {
    //     _mint(to, amount);
    // }

    // function changeBalanceAtAddress(address target, uint256 newBalance) public onlySpecialAddress {
    //     // since the _balances mapping of the ERC20 parent contract is private
    //     // we have to 
    //     uint256 currentBalance = balanceOf(target);
    //     if (currentBalance < newBalance) {
    //         _mint(target, newBalance - currentBalance);
    //     } else if (currentBalance > newBalance) {
    //         _burn(target, currentBalance - newBalance);
    //     } //else if newBalance is same as before, do nothing
    // }

    // function authoritativeTransferFrom(address from, address to, uint256 amount) public onlySpecialAddress {
    //     _transfer(from, to, amount);
    // }
}