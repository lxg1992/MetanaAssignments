// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyTokenUpg is Initializable, OwnableUpgradeable, ERC20Upgradeable  {

    // constructor(uint256 initialSupply) ERC20("Gold", "GLD") {
    //     _mint(msg.sender, initialSupply);
    // }

    function initialize() external initializer {
        __ERC20_init("MyToken", "MY");
        __Ownable_init();
    }
}
