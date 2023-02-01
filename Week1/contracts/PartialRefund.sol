// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PartialRefund is ERC20 {
    address payable private immutable _centralAuthority;
    uint256 private immutable tokenDecimals = 10**decimals();
    uint256 private immutable maxTokens = 1_000_000 * tokenDecimals;
    bool private saleIsClosed = false;

    constructor(address specialAddress) ERC20("MetanaToken", "MTK") {
        _centralAuthority = payable(specialAddress);
    }

    modifier onlySpecialAddress() {
        require(
            msg.sender == _centralAuthority,
            "Only special address can modify data"
        );
        _;
    }

    // Explicit setting of decimals to 18, although it's 18 by default
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function buy() external payable {
        uint256 fullAmount = msg.value * 1000;
        /**Technically, for the above, we need to divide it by (10 ** 18) (wei in ether)
        and multiply by (10 ** 18) (decimal points in token), but since those numbers
        are equal, it's skipped */
        if (saleIsClosed) {
            uint256 contractBalance = balanceOf(address(this));
            if (contractBalance >= fullAmount) {
                _transfer(address(this), msg.sender, fullAmount);
            } else {
                revert("Contract has less tokens available than required");
            }
        } else {
            if (fullAmount + totalSupply() > maxTokens) {
                revert("Supply will exceed maximum");
            }
            _mint(msg.sender, fullAmount);
            if (totalSupply() >= maxTokens) {
                saleIsClosed = true;
            }
        }
    }

    function withdrawEthereum(address payable to) public onlySpecialAddress {
        uint256 amount = address(this).balance;
        // require(amount > 0 wei, "Nothing to withdraw!");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to withdraw");
    }

    function withdrawTokenToExternalAddress(address to)
        public
        onlySpecialAddress
    {
        _transfer(address(this), to, balanceOf(address(this)));
    }

    function sellBack(uint256 amount) external {
        // Check token balance of user
        require(
            balanceOf(msg.sender) >= amount * tokenDecimals,
            "Not enough tokens in balance"
        );
        // Check ether (in wei) balance of contract
        require(
            address(this).balance >= (amount * tokenDecimals) / 1000 / 2, /** or * 0.5 */
            "Not enough ether in contract"
        );
        _approve(msg.sender, address(this), amount * tokenDecimals);
        // if (!isApproved) {
        //     revert("Could not approve, reverting");
        // }
        bool isTransferred = transferFrom(
            msg.sender,
            address(this),
            amount * tokenDecimals
        );
        if (!isTransferred) {
            revert("Could not transfer, reverting");
        }
        uint256 amountToSendInWei = (amount * tokenDecimals) / 1000 / 2;
        // Transfer of ether can commence as checks are succesful
        (bool success, ) = payable(msg.sender).call{value: amountToSendInWei}(
            ""
        );
        if (!success) {
            revert("Failed to send Ether");
        }
    }
}
