pragma solidity ^0.8.0;

contract ECRECOVER{
    address addressTest = 0x5BD00AB64cA841f01BEDee69d431be70169Cf744;
    bytes32 msgHash = 0xdaa637fb8228bd9d9d4d5fdfc757f0a183a62189287084db24ba38d2ac570354;
    uint8 v = 0x1b;
    bytes32 r = 0x93cbd9415c328f3dcd25d3e7419af4cbeb51d66bee8fa176b28b9872b073d1bb;
    bytes32 s = 0x5089995c398ba6c8e52b03e7be4de6eb880929429f4c9a5b44e76c0dc92ea04a;


    function verify() public view returns(bool) {
        // Use ECRECOVER to verify address
        return (ecrecover(msgHash, v, r, s) == (addressTest));
    }
}