// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint8[] private numbers8bit;
    uint256 private value;
    bytes32 private currentHash;

    function keccakBytesHash(bytes memory _bytes32Val) public onlyOwner {
        currentHash = keccak256(_bytes32Val);
    }

    struct Person {
        string name;
        uint8 age;
        uint8 heightInCm;
        bool senior;
        string[] hobbies;
    }

    mapping(address => Person) private people;

    function setNumbers8bit(uint8[] memory _numbers8bit) public onlyOwner {
        numbers8bit = _numbers8bit;
    }

    function alterNumber8bit(uint256 _index, uint8 _value) public onlyOwner {
        numbers8bit[_index] = _value;
    }

    function alterMultipleNumbers8bit(
        uint256[] memory _indexes,
        uint8[] memory _values
    ) public onlyOwner {
        for (uint256 i = 0; i < _indexes.length; i++) {
            numbers8bit[_indexes[i]] = _values[i];
        }
    }

    function getNumbers8bit() public view returns (uint8[] memory) {
        return numbers8bit;
    }

    function setPersonStruct(
        address _address,
        Person memory _person
    ) public onlyOwner {
        people[_address] = _person;
    }

    function setPerson(
        address _address,
        string memory _name,
        uint8 _age,
        uint8 _heightInCm,
        bool _senior,
        string[] memory _hobbies
    ) public onlyOwner {
        Person memory person = Person({
            name: _name,
            age: _age,
            heightInCm: _heightInCm,
            senior: _senior,
            hobbies: _hobbies
        });

        people[_address] = person;
    }

    function getPerson(
        address _address
    ) public view returns (string memory, uint8, uint8, bool, string[] memory) {
        Person memory person = people[_address];
        return (
            person.name,
            person.age,
            person.heightInCm,
            person.senior,
            person.hobbies
        );
    }

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function storeValue(uint256 newValue) public onlyOwner {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieveValue() public view returns (uint256) {
        return value;
    }
}
