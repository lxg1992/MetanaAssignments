# EVM puzzles

A collection of EVM puzzles. Each puzzle consists on sending a successful transaction to a contract. The bytecode of the contract is provided, and you need to fill the transaction data that won't revert the execution.

## How to play

Clone this repository and install its dependencies (`npm install` or `yarn`). Then run:

```
npx hardhat play
```

And the game will start.

In some puzzles you only need to provide the value that will be sent to the contract, in others the calldata, and in others both values.

You can use [`evm.codes`](https://www.evm.codes/)'s reference and playground to work through this.

## Solutions

### 1

The CALLVALUE will be used as the "input" for the JUMP instruction. Since slots/bytes 02-07 will revert the transaction, we make slot 08 the "destination" and because it's a valid JUMPDEST, the next logical instruction is STOP, which simply exits the program

### 2

In this example, we have to figure out how the SUBtraction of (CODESIZE - CALLVALUE) can be fed into the JUMP instruction such that it finds the JUMPDEST in slot 06. Since the the slots go from 0 - 9 (included), the number of slots is 10 and so CODESIZE = 10 (or 0x0a in hex). To get to "6", we will need 10 - x = 6, so X is equal to 4. Entering 4 as the CALLVALUE completes the puzzle.

### 3

In hexadecimal, we know that each byte takes up two hexadecimal digits (00 to ff = 0 to 255). For as long as the hexadecimal number input as calldata takes up 8 characters, the test will pass. (i.e. 0xffffffff and 0x10000000 will work the same); 

### 4
CODESIZE = 12 = 0c = 00001100
JUMPDEST = 10 = 0a = 00001010
XOR above binary values (one or the other but not BOTH same value)
CALLVALUE ?        = 00000110 = 6 = 06

CALLVALUE of 6 will resolve the JUMP instruction to take 10 as input.

### 5


