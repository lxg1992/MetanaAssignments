// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

/** Create a lottery contract which can either accept 0.01 ether in which case the spoils go to the winner or if for free. */
contract AutoLottery is ERC2771Context {
    event Entered(
        address indexed who,
        uint8 indexed guess,
        bool indexed isPaid
    );

    event WinnerPicked(
        address indexed who,
        uint8 indexed guess,
        bool indexed isPaid
    );

    struct Entry {
        bool isEntered;
        uint8 guess;
        bool isPaid;
    }

    address immutable owner;

    // uint8 guess;
    // uint32 roundNumber;

    mapping(address => mapping(uint32 => Entry)) public entries;
    //[player][round] = Entry
    mapping(uint32 => mapping(uint8 => address)) public entryByGuess;
    //[round][guess] = player

    uint32 public roundNumber = 0;

    address[] public latestEntrants;
    uint8[] public latestPicks;
    address[] public previousWinners;
    uint8[] public previousWinningPicks;

    constructor(
        MinimalForwarder forwarder // Initialize trusted forwarder
    ) ERC2771Context(address(forwarder)) {
        owner = _msgSender();
    }

    function getLatestEntrants() external view returns (address[] memory) {
        return latestEntrants;
    }

    function getLatestPicks() external view returns (uint8[] memory) {
        return latestPicks;
    }

    function getPreviousWinners() external view returns (address[] memory) {
        return previousWinners;
    }

    function getPreviousWinningPicks() external view returns (uint8[] memory) {
        return previousWinningPicks;
    }

    modifier isNotDoublePicked(uint8 guess) {
        bool isAlreadyPicked;
        for (uint8 i = 0; i < latestPicks.length; i++) {
            if (latestPicks[i] == guess) {
                isAlreadyPicked = true;
                break;
            }
        }
        require(
            !isAlreadyPicked,
            "Number already picked for the round, choose another"
        );
        _;
    }

    modifier onlyAuth() {
        require(_msgSender() == owner, "Only admin can do this");
        _;
    }

    function enterFree(uint8 guess) external isNotDoublePicked(guess) {
        require(guess < 100, "Guess must be less than 100");
        address who = _msgSender(); // Changed from msg.sender
        require(
            entries[who][roundNumber].isEntered == false,
            "Already entered"
        );
        entries[who][roundNumber] = Entry(true, guess, false);
        entryByGuess[roundNumber][guess] = who;
        latestEntrants.push(who);
        latestPicks.push(guess);
        emit Entered(who, guess, false);
    }

    function enterPaid(uint8 guess) external payable isNotDoublePicked(guess) {
        require(guess < 100, "Guess must be less than 100");
        require(msg.value == 0.01 ether, "Must pay 0.01 ether");
        address who = _msgSender(); // Changed from msg.sender
        require(
            entries[who][roundNumber].isEntered == false,
            "Already entered"
        );
        entries[who][roundNumber] = Entry(true, guess, true);
        entryByGuess[roundNumber][guess] = who;
        latestEntrants.push(who);
        latestPicks.push(guess);
        emit Entered(who, guess, true);
    }

    function pickWinner() external onlyAuth {
        require(latestEntrants.length > 0, "No entrants");
        uint8 winningNumber = random() % 100;
        address winner = entryByGuess[roundNumber][winningNumber];
        if (winner != address(0)) {
            previousWinners.push(winner);
            previousWinningPicks.push(winningNumber);
            if (entries[winner][roundNumber].isPaid) {
                payable(winner).transfer(address(this).balance);
                emit WinnerPicked(winner, winningNumber, true);
            } else {
                emit WinnerPicked(winner, winningNumber, false);
            }
        } else {
            previousWinners.push(address(0));
            previousWinningPicks.push(255);
        }
        delete latestEntrants;
        delete latestPicks;
        roundNumber++;
        //Doesn't need to have a winner. If no one wins, the winning number is 255 and no one wins.
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function random() private view returns (uint8) {
        return
            uint8(
                uint(
                    keccak256(
                        abi.encodePacked(
                            block.difficulty,
                            block.timestamp,
                            latestEntrants,
                            latestPicks
                        )
                    )
                )
            );
    }
}
