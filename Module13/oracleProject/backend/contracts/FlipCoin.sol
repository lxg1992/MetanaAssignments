pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

//0x5A861794B927983406fCE1D062e00b9368d97Df6 - wrapper
//0x514910771AF9Ca656af840dff83E8264EcF986CA - link
//0x271682DEB8C4E0901D1a1550aD2e64D568E69909 - coordinator
contract CoinFlip is VRF2WrapperConsumerBase {
    event CoinFlipRequest(uint256 requestId, CoinSide side);
    event CoinFlipResponse(uint256 requestId, CoinSide side, bool isWon);

    address constant linkAddress = 0x514910771AF9Ca656af840dff83E8264EcF986CA;
    address constant vrfWrapperAddress =
        0x5A861794B927983406fCE1D062e00b9368d97Df6;

    mapping(uint256 => CoinFlipStatus) public statuses;

    uint128 constant entreeFee = 0.001 ether;
    uint32 constant callbackGasLimit = 1000000;
    uint32 constant numWords = 1;
    uint16 constant requestConfirmations = 3;

    struct CoinFlipStatus {
        uint256 fees;
        uint256 randomWord;
        address player;
        bool didWin;
        bool fulfilled;
        CoinFlipSelection choice;
    }

    enum CoinSide {
        Heads,
        Tails
    }

    constructor() VRF2WrapperConsumerBase(linkAddress, vrfWrapperAddress) {}

    function flip(CoinSide choice) external payable returns (uint256) {
        uint256 requestId = requestRandomness(
            linkAddress,
            entreeFee,
            callbackGasLimit,
            numWords
        );

        statuses[requestId] = CoinFlipStatus({
            fees: VRF2_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWord: 0,
            player: msg.sender,
            didWin: false,
            fulfilled: false,
            choice: choice
        });

        emit CoinFlipRequest(requestId, choice);
        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        require(
            statuses[requestId].player != address(0),
            "requestId not found"
        );
        require(
            statuses[requestId].fulfilled == false,
            "requestId already fulfilled"
        );

        statuses[requestId].randomWord = randomWords[0];
        statuses[requestId].didWin = randomWords[0] % 2 == 0
            ? statuses[requestId].choice == CoinSide.Heads
            : statuses[requestId].choice == CoinSide.Tails;
        statuses[requestId].fulfilled = true;

        if (statuses[requestId].didWin) {
            payable(statuses[requestId].player).transfer(
                statuses[requestId].fees * 2
            );
        }

        emit CoinFlipResponse(
            requestId,
            statuses[requestId].choice,
            statuses[requestId].didWin
        );
    }
}
