// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";


contract MyNFT is ERC721, Ownable {
    using BitMaps for BitMaps.BitMap;

    bytes32 constant rootFor3 = 0xeaa21d43bc3c1d79fd04ec62457248ab54c5eaccab075f213a1954be059bd327;
    uint constant maxMints = 3;
    uint totalMints = 0;
    uint max = 9999
    // bytes32 constant rootFor10 = 0x7650aafbf2a9b18e825df7c1fc708a853f9523a08d8397c6674a30f667136300;

    BitMaps.BitMap bitmap;

    struct Commit {
        uint256 commit;
        uint64 block;
        bool revealed;
    }

    mapping(address => Commit) public commits;

    enum Stages {
        PreMint,
        Mintable,
        Distributed
    }

    function advanceStage() external onlyOwner{
        nextStage();
    }

    Stages public stage = Stages.PreMint;

    //Counter to count the bits.

    constructor() ERC721("MyNFT", "NFT") {
        bitmap.setTo(0, true); //0x70a85c13Ca3c79C5d5e0452Da91A6E64f8c7Db80
        bitmap.setTo(1, true); //0xbc190065f7CDb10C970CBF57cB24401c4c86d4CC
        bitmap.setTo(2, true); //0xf10c2Fbc92BC4490aec8D93859762f10E6893884
        // bitmap.setTo(3, true); //0x1116793a28Cbdfa5182f24366fFCbbbC3094CF40
        // bitmap.setTo(4, true); //0x667F1F3947e152C0d517Fd0D2a0E81dd9390FEdD
        // bitmap.setTo(5, true); //0xeBB35336d5bA07C788973D6f8C8496E5bA779840
        // bitmap.setTo(6, true); //0xC3f753A136EF893a24972635a4cA29EFAaA94729
        // bitmap.setTo(7, true); //0x6990f0AC60f306A630EA2CD4BcB868119E4B7353
        // bitmap.setTo(8, true); //0x1591E22EBF19bFcd234FC04cdA03E41d6Dc963B0
        // bitmap.setTo(9, true); //0xFe0985F3e4175487fB948A906867EbE9f307c6E4
    }

    function commit(uint idx) public {
        commits[msg.sender].commit = idx;
        commits[msg.sender].block = uint64(block.number);
        commits[msg.sender].revealed = false;
    }

    modifier atStage(Stages _stage) {
        require(stage == _stage);
        _;
    }
    
    modifier transitionAfter() {
        _;
        nextStage();
    }

    

    function redeem(uint256 indexN, bytes32[] calldata proof)
    external atStage(Stages.Mintable)
    {
        require(bitmap.get(indexN) == true, "Cannot claim this");
        require(_verify(_leaf(msg.sender, indexN), proof), "Invalid merkle proof");
        safeMint(msg.sender, indexN);
        if (totalMints == maxMints) nextStage();
    }

    function _leaf(address account, uint256 indexN)
    internal pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(account, indexN));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof)
    internal view returns (bool)
    {
        return MerkleProof.verify(proof, rootFor3, leaf);
    }
    
    function nextStage() internal {
        stage = Stages(uint(stage) + 1);
    }

    function safeMint(address to, uint256 indexN) public onlyOwner {
        _safeMint(to, indexN);
        totalMints +=1;
    }

    function reveal(bytes32 revealHash) public {
    //make sure it hasn't been revealed yet and set it to revealed
    require(commits[msg.sender].revealed==false,"CommitReveal::reveal: Already revealed");
    commits[msg.sender].revealed=true;
    //require that they can produce the committed hash
    require(_leaf(revealHash)==commits[msg.sender].commit,"CommitReveal::reveal: Revealed hash does not match commit");
    //require that the block number is greater than the original block
    require(uint64(block.number)>commits[msg.sender].block + 10,"CommitReveal::reveal: Reveal and commit happened on the same block");
    //require that no more than 250 blocks have passed
    require(uint64(block.number)<=commits[msg.sender].block+250,"CommitReveal::reveal: Revealed too late");
    //get the hash of the block that happened after they committed
    bytes32 blockHash = blockhash(commits[msg.sender].block);
    //hash that with their reveal that so miner shouldn't know and mod it with some max number you want
    uint8 random = uint8(keccak256(abi.encodePacked(blockHash,revealHash))) % max;
    emit RevealHash(msg.sender,revealHash,random);
  }
  event RevealHash(address sender, bytes32 revealHash, uint8 random);
}




