#Slither

The following were detected as flags during `slither` testing

##Low Level

Low level call in PartialRefund.withdrawEthereum(address) (contracts/PartialRefund.sol#55-60):
        - (success) = to.call{value: amount}() (contracts/PartialRefund.sol#58)
Low level call in PartialRefund.sellBack(uint256) (contracts/PartialRefund.sol#69-100):
        - (success) = address(msg.sender).call{value: amountToSendInWei}() (contracts/PartialRefund.sol#94-96)
Low level call in TokenSale.withdraw(address) (contracts/TokenSale.sol#43-48):
        - (success) = to.call{value: amount}() (contracts/TokenSale.sol#46)

Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#low-level-calls

* We don't have any other way to call the transfer of ethereum so we have to use the `call` method;

## Zero-check

GodMode.constructor(address).specialAddress (contracts/GodMode.sol#9) lacks a zero-check on :
                - _specialAddress = specialAddress (contracts/GodMode.sol#10)
PartialRefund.constructor(address).specialAddress (contracts/PartialRefund.sol#12) lacks a zero-check on :
                - _centralAuthority = address(specialAddress) (contracts/PartialRefund.sol#13)
PartialRefund.withdrawEthereum(address).to (contracts/PartialRefund.sol#55) lacks a zero-check on :
                - (success) = to.call{value: amount}() (contracts/PartialRefund.sol#58)
Sanctioned.constructor(address).specialAddress (contracts/Sanctioned.sol#10) lacks a zero-check on :
                - _centralAuthority = specialAddress (contracts/Sanctioned.sol#11)
TokenSale.constructor(address).specialAddress (contracts/TokenSale.sol#12) lacks a zero-check on :
                - _centralAuthority = address(specialAddress) (contracts/TokenSale.sol#13)
TokenSale.withdraw(address).to (contracts/TokenSale.sol#43) lacks a zero-check on :
                - (success) = to.call{value: amount}() (contracts/TokenSale.sol#46)

Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation

* In these cases, in the constructor assigning central authority to a 0x0 address will make the contract unusable. But transferring the Ether to a non existing address will cause it to be lost forever, so it is a valuable flag.

##Different Versions

Different versions of Solidity are used:
        - Version used: ['^0.8.0', '^0.8.9']
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol#4)
        - ^0.8.0 (node_modules/@openzeppelin/contracts/utils/Context.sol#4)
        - ^0.8.9 (contracts/GodMode.sol#2)
        - ^0.8.9 (contracts/PartialRefund.sol#2)
        - ^0.8.9 (contracts/Sanctioned.sol#2)
        - ^0.8.9 (contracts/TokenSale.sol#2)

Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used

* The different versions used by our own and library contracts doesn't pose an issue

