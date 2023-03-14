// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";


contract MyNFT is ERC721, Ownable {
    event RevealNum(uint8 random);
    event RevealHash(bytes32 hash);

    using BitMaps for BitMaps.BitMap;
    
    bytes32 constant rootFor3 = 0x03c18bb8e5674709cec55ca40ebee39ec9c69dc52a98271721cdcfa2314e5371;
    // bytes32 constant rootFor10 = 0x7650aafbf2a9b18e825df7c1fc708a853f9523a08d8397c6674a30f667136300;
    uint constant maxParticipants = 3;
    uint totalMints = 0;
    uint totalCommits = 0;
    uint8 max = 250;
    Stages public stage = Stages.Commit;

    BitMaps.BitMap bitmap;

    struct Commit {
        uint8 commit;
        uint64 block;
        bool revealed;
        uint8 id;
    }

    mapping(address => Commit) public commits;

    enum Stages {
        Commit,
        Mintable,
        Distributed
    }

    function advanceStage() external onlyOwner{
        nextStage();
    }


    //Counter to count the bits.

    constructor() ERC721("MyNFT", "NFT") {
        bitmap.setTo(0, true); //0x70a85c13Ca3c79C5d5e0452Da91A6E64f8c7Db80
        // proof: 0x4862d97686e0f39b2f426d9f9a7337496a957b71108d06f3cb1d06cb1e894d6d
        bitmap.setTo(1, true); //0xbc190065f7CDb10C970CBF57cB24401c4c86d4CC
        // proof: 0x75c578f0dece6608d3483eb18693a9b6ed14202f50e1b1188367732df5303a6b
        bitmap.setTo(2, true); //0xf10c2Fbc92BC4490aec8D93859762f10E6893884
        // proof: 0x6caebccc9b67d476dea1691a7683a1a6f1c904e591bbb690a58ab5255d138e4a
        // bitmap.setTo(3, true); //0x1116793a28Cbdfa5182f24366fFCbbbC3094CF40
        // bitmap.setTo(4, true); //0x667F1F3947e152C0d517Fd0D2a0E81dd9390FEdD
        // bitmap.setTo(5, true); //0xeBB35336d5bA07C788973D6f8C8496E5bA779840
        // bitmap.setTo(6, true); //0xC3f753A136EF893a24972635a4cA29EFAaA94729
        // bitmap.setTo(7, true); //0x6990f0AC60f306A630EA2CD4BcB868119E4B7353
        // bitmap.setTo(8, true); //0x1591E22EBF19bFcd234FC04cdA03E41d6Dc963B0
        // bitmap.setTo(9, true); //0xFe0985F3e4175487fB948A906867EbE9f307c6E4
    }

    modifier atStage(Stages _stage) {
        require(stage == _stage);
        _;
    }
    
    modifier transitionAfter() {
        _;
        nextStage();
    }

    function commit(uint8 idx) public atStage(Stages.Commit){
        require(idx < max, "Out of range");
        commits[msg.sender].commit = idx;
        commits[msg.sender].block = uint64(block.number);
        commits[msg.sender].revealed = false;
        commits[msg.sender].id = 255; //outside of max range. This is changed in 'reveal' function
        totalCommits += 1;
        if (totalCommits == maxParticipants) {
            nextStage();
        }
        emit RevealHash(_leaf(msg.sender, idx));
    }

    function reveal(bytes32 revealHash) public {
        require(commits[msg.sender].revealed==false,"CommitReveal::reveal: Already revealed");
        commits[msg.sender].revealed=true;
        require(revealHash == _leaf(msg.sender, commits[msg.sender].commit),"CommitReveal::reveal: Revealed hash does not match commit");
        require(uint64(block.number)>commits[msg.sender].block + 10,"CommitReveal::reveal: Reveal and commit happened on the same block");
        bytes32 blockHash = blockhash(commits[msg.sender].block);
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockHash,revealHash)))) % max;
        commits[msg.sender].id = random;
        emit RevealNum(random);
    }

    function redeem(uint8 indexN, bytes32[] calldata proof) external atStage(Stages.Mintable) {
        require(bitmap.get(indexN) == true, "Cannot claim this");
        require(_verify(_leaf(msg.sender, indexN), proof), "Invalid merkle proof");
        require(commits[msg.sender].revealed, "Rand not revelead");
        _safeMint(msg.sender, commits[msg.sender].id);
        if (totalMints == maxParticipants) nextStage();
    }

    function _leaf(address account, uint8 indexN) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(account, indexN));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof) internal pure returns (bool) {
        return MerkleProof.verify(proof, rootFor3, leaf);
    }
    
    function nextStage() internal {
        stage = Stages(uint(stage) + 1);
    }
}




