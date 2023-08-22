// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    constructor(
        uint256 minDelay, //how long to wait before executing
        address[] memory proposers, //list of addresses that can propose
        address[] memory executors,
        address admin //list of addresses that can execute
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
