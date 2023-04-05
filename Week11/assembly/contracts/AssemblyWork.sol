// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract BitWise {

    // count the number of bit set in data.  i.e. data = 7, result = 3

    function countBitSet(uint8 data) public pure returns (uint8 result) {
        for( uint i = 0; i < 8; i += 1) {
            if( ((data >> i) & 1) == 1) {
                result += 1;
            }
        }
    }

    function countBitSetAsm(uint8 data ) public pure returns (uint8 result) {
        assembly {
            let mask := 1
            for { let i := 0 } lt(i, 8) { i := add(i, 1) } {
                if and(shr(i, data), mask) {
                    result := add(result, 1)
                }
            }
        }
    }
}

contract Charazar {


   function charAt(string memory input, uint index) public pure returns(bytes2) {
        assembly {
            let strPtr := add(input, 0x20)  // Get pointer to string data
            let strLen := mload(input)  // Get length of string

            // Check if index is within bounds
            if gt(index, sub(strLen, 1)) {
                return(0, 32)
            }

            // Get pointer to the byte at the specified index
            let bytePtr := add(strPtr, index)
            // Load the byte value at the specified index
            let byteVal := mload(bytePtr)
            // Return the byte value
            mstore(0, byteVal)
            mstore(1, 0)
            return(0, 32)
        }

   }
}