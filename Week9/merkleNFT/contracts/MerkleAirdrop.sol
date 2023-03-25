// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract MyNFT is ERC721, Ownable, ReentrancyGuard {
    event RevealNum(uint8 random);
    event ShowHash(bytes32 _hash);

    using BitMaps for BitMaps.BitMap;
    
    bytes32 constant rootFor3 = 0x03c18bb8e5674709cec55ca40ebee39ec9c69dc52a98271721cdcfa2314e5371;
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
        commits[msg.sender].id = 255; //outside of max range. This is changed in 'reveal' function
        totalCommits += 1;
        if (totalCommits == maxParticipants) {
            nextStage();
        }
        emit ShowHash(_leaf(msg.sender, idx));
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
        require(bitmap.get(indexN) == false, "Already claimed");
        require(_verify(_leaf(msg.sender, indexN), proof), "Invalid merkle proof");
        require(commits[msg.sender].revealed, "NFT ID Not revealed");
        _safeMint(msg.sender, commits[msg.sender].id);
        bitmap.setTo(indexN, true);
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

    function mint(uint8 tokenId) external payable {
        require(msg.value == 0.01 ether);
        _mint(msg.sender, uint256(tokenId));
    }

    function withdraw() external onlyOwner {
        require(totalMints >= maxParticipants / 2, "50% of NFTs have not yet minted");
        payable(msg.sender).call{value: addres(this).balance}("");
    }

    function multiTransfer(address[] to, uint8[] ids) external {
        require(to.length == ids.length, "Mismatch of array lengths");
        for(uint i; i < to.length; i++) {
            transferFrom(msg.sender, to[i], ids[i]);
        }
    }
}




