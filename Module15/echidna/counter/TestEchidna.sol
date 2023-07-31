pragma solidity ^0.8.0;

contract Counter {
    uint256 public count;

    constructor() {
        count = 0;
    }

    function increment() public {
        count += 1;
    }

    function decrement() public {
        count -= 1;
    }
}

contract TestCounter is Counter {
    address echidna = tx.origin;

    function echidna_test_pass() public view returns (bool) {
        return true;
    }
}

contract TestAssert {
    function echidna_test_assert() public view returns (bool) {
        assert(false);
    }
}
