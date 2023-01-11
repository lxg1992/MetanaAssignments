// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PartialRefund is ERC20 {
    address payable private _centralAuthority;
    uint private tokenDecimals = 10 ** decimals();
    uint private maxTokens = 1_000_000 * tokenDecimals;
    bool private saleIsClosed = false;
    
    constructor(address specialAddress) ERC20("MetanaToken", "MTK") {
        _centralAuthority = payable(specialAddress);
    }

    modifier onlySpecialAddress {
        require(msg.sender == _centralAuthority, "Only special address can modify data");
        _;
    }

    // Explicit setting of decimals to 18, although it's 18 by default
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function mint1000() external payable {
        require(msg.value == 1 ether, "Value must be 1 ether");
        require(!saleIsClosed, "Sorry, the sale is closed");
        _mint(msg.sender, 1000 * tokenDecimals);
        if (totalSupply() >= maxTokens) {
            saleIsClosed = true;
        }
    }

    function withdraw(address payable to) public onlySpecialAddress{
        uint amount = address(this).balance;
        require(amount > 0 wei, "Nothing to withdraw!");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to withdraw");
    }

    function sellBack(uint amount) external {
        // Check token balance of user
        require(balanceOf(msg.sender) >= amount * tokenDecimals, "Not enough tokens in balance");
        // Check ether (in wei) balance of contract
        require(address(this).balance >= amount * tokenDecimals / 1000 / 2 /** or * 0.5 */, "Not enough ether in contract");
        bool isApproved = approve(address(this), amount * tokenDecimals);
        if (!isApproved) {
            revert("Could not approve, reverting");
        }
        bool isTransferred = transferFrom(msg.sender, address(this), amount * tokenDecimals);
        if (!isTransferred) {
            revert("Could not transfer, reverting");
        }
        uint amountToSendInWei = amount * tokenDecimals / 1000 / 2;
        // Transfer of ether can commence as checks are succesful
        (bool success, ) = payable(msg.sender).call{value: amountToSendInWei}("");
        if(!success) {
            revert("Failed to send Ether");
        }

    }

    


}