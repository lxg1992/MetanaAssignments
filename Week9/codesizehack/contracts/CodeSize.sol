// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";

contract Check {
    using Address for address;

    function badHasCodeLength(address _addr) external view returns (bool) {
        return _addr.isContract();
    }

    modifier onlyEOA() {
        require(msg.sender == tx.origin, "Not EOA");
        _;
    }

    function fixedHasCodeLength(
        address _addr
    ) external view onlyEOA returns (bool) {
        return _addr.isContract();
    }
}

contract Exploit {
    Check c;
    bool public isContract;

    constructor(address checker) {
        c = Check(checker);
        isContract = c.badHasCodeLength(address(this));
    }
}

contract Fixed {
    Check c;
    bool public isContract;

    constructor(address checker) {
        c = Check(checker);
        isContract = c.fixedHasCodeLength(address(this));
    }
}
