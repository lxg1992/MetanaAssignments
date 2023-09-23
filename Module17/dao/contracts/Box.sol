// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private value;
    string private name;
    uint8[] private numbers8bit;
    address[] private goodGuys;

    function setGoodGuys(address[] memory _goodGuys) public onlyOwner {
        goodGuys = _goodGuys;
    }

    function getGoodGuys() public view returns (address[] memory) {
        return goodGuys;
    }

    function setNumbers8bit(uint8[] memory _numbers8bit) public onlyOwner {
        numbers8bit = _numbers8bit;
    }

    function getNumbers8bit() public view returns (uint8[] memory) {
        return numbers8bit;
    }

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    function setName(string memory _name) public onlyOwner {
        name = _name;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    // Stores a new value in the contract
    function store(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
