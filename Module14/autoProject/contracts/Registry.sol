// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract Registry is ERC2771Context {
    event Registered(address indexed who, string name);

    mapping(address => string) public names;
    mapping(string => address) public owners;

    constructor(
        MinimalForwarder forwarder // Initialize trusted forwarder
    ) ERC2771Context(address(forwarder)) {}

    function register(string memory name) external {
        require(owners[name] == address(0), "Name taken");
        address owner = _msgSender(); // Changed from msg.sender
        owners[name] = owner;
        names[owner] = name;
        emit Registered(owner, name);
    }
}

/** Create a lottery contract which can either accept 0.01 ether in which case the spoils go to the winner or if for free. */
contract AutoLottery is ERC2771Context {
    event Entered(
        address indexed who,
        uint8 indexed guess,
        bool indexed isPaid
    );

    struct Entry {
        // address who;
        uint8 guess;
        bool isPaid;
    }

    // uint8 guess;
    // uint32 roundNumber;

    mapping(address => mapping(uint32 => Entry)) public entries;
    //[player][round] = Entry
    mapping(uint32 => mapping(uint8 => address[])) public entriesByGuess;

    uint32 public roundNumber = 0;

    address[] public latestEntrees;
    address[] public previousWinners;
    uint8[] public previousWinningNumbers;

    constructor(
        MinimalForwarder forwarder // Initialize trusted forwarder
    ) ERC2771Context(address(forwarder)) {}

    function enterFree(uint8 guess) external {
        require(guess < 100, "Guess must be less than 100");
        address who = _msgSender(); // Changed from msg.sender
        entries[who][roundNumber] = Entry(guess, false);
        emit Entered(who, roundNumber);
    }

    function enterPaid(uint8 guess) external payable {
        require(msg.value == 0.01 ether, "Must pay 0.01 ether");
        require(guess < 100, "Guess must be less than 100");
        address who = _msgSender(); // Changed from msg.sender
        entries[who][roundNumber] = Entry(guess, true);
        emit Entered(who, roundNumber);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
