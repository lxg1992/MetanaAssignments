// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

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
}