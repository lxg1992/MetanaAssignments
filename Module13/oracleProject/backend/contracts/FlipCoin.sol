pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//0x5A861794B927983406fCE1D062e00b9368d97Df6 - wrapper
//0x514910771AF9Ca656af840dff83E8264EcF986CA - link
//0x271682DEB8C4E0901D1a1550aD2e64D568E69909 - coordinator
contract FlipCoin is VRFV2WrapperConsumerBase {
    event CoinFlipRequest(address sender, uint256 requestId, CoinSide side);
    event CoinFlipResponse(address sender, uint256 requestId, bool isWon);

    // For Goerli https://docs.chain.link/vrf/v2/direct-funding/supported-networks#goerli-testnet
    address constant linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    address constant vrfWrapperAddress =
        0x708701a1DfF4f478de54383E49a627eD4852C816;

    mapping(uint256 => CoinFlipStatus) public statuses;

    uint32 constant callbackGasLimit = 1000000;
    uint32 constant numWords = 1;
    uint16 constant requestConfirmations = 3;

    enum CoinSide {
        Heads,
        Tails
    }

    struct CoinFlipStatus {
        uint256 fees;
        uint256 randomWord;
        address player;
        bool didWin;
        bool fulfilled;
        CoinSide choice;
    }

    constructor() VRFV2WrapperConsumerBase(linkAddress, vrfWrapperAddress) {}

    function flip(CoinSide choice) external payable returns (uint256) {
        uint256 requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );

        statuses[requestId] = CoinFlipStatus({
            fees: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWord: 0,
            player: msg.sender,
            didWin: false,
            fulfilled: false,
            choice: choice
        });

        emit CoinFlipRequest(msg.sender, requestId, choice);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        require(statuses[requestId].fees > 0, "Request not found");
        require(
            statuses[requestId].fulfilled == false,
            "requestId already fulfilled"
        );

        statuses[requestId].randomWord = randomWords[0];
        statuses[requestId].didWin = randomWords[0] % 2 == 0
            ? statuses[requestId].choice == CoinSide.Heads
            : statuses[requestId].choice == CoinSide.Tails;
        statuses[requestId].fulfilled = true;

        emit CoinFlipResponse(
            statuses[requestId].player,
            requestId,
            statuses[requestId].didWin
        );
    }

    function getStatus(
        uint256 requestId
    ) external view returns (CoinFlipStatus memory) {
        return statuses[requestId];
    }

    function getContractERC20Balance() external view returns (uint256) {
        return IERC20(linkAddress).balanceOf(address(this));
    }
}

//Deploy contract 0xb5Fe9D933E248f4C7740D754FE7Aa44Dbcc90EE7
//Fund with link
