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
CALLVALUE ? = 00000110 = 6 = 06

CALLVALUE of 6 will resolve the JUMP instruction to take 10 as input.

### 5

<-top - bottom->
Answer is decimal 16 (hex 0010)
[0010] val
[0010 0010] dup1
[0100] mul
[0100 0100] push2
[1] eq
[0c = a, 1 = b] push1
[] jumpi (jump to a if b > 0)
[] jumpdest
[] stop

### 6

<-top - bottom->
[00]
[0x000000000000000000000000000000000000000000000000000000000000000a]

We need to enter a 32byte sequence such that the 0th byte of it (from the right to the left) will be '0a'
That's then used as the instruction for JUMP => JUMPDEST and then STOPs the program

### 7

00 36 CALLDATASIZE
01 6000 PUSH1 00
03 80 DUP1
04 37 CALLDATACOPY

These instructions simply copy the CALLDATA into memory

05 36 CALLDATASIZE
06 6000 PUSH1 00
08 6000 PUSH1 00
0A F0 CREATE

These create a contract from memory using the length of CALLDATA as the number of bytes to use for creation (with 0 offset and 0 wei) (so just CALLDATA)

The goal is to create a contract which when fed into the EXTCODESIZE will return 01

We first have to PUSH1 01 (6001) as VALUE
Then PUSH1 00 (6000) as OFFSET
for MSTORE instruction (52)
Now our Memory is 0x0000000000000000000000000000000000000000000000000000000000000001
Which we get by PUSH1 01 (6001) for BYTE LENGTH (so just 1 byte)
And PUSH1 1f the offset of 31 Bytes of MEMORY
F3 (return) uses the previous two parameters as arguments.
(60016000526001601ff3)
So, feeding 0x60016000526001601ff3 as call data gives us the EXTCODESIZE of 1 which then satisfies the equation of EQ 1 which lets us get to the JUMPDEST.

### 8

Again this block:

00 36 CALLDATASIZE
01 6000 PUSH1 00
03 80 DUP1
04 37 CALLDATACOPY

Copies the CALLDATA into memory

This block:

05 36 CALLDATASIZE
06 6000 PUSH1 00
08 6000 PUSH1 00
0A F0 CREATE

Creates a contract FROM memory and puts the address on the stack

[addr_dep] <- current stack

[0 0 0 0 0 addr_dep] = PUSH1 00 and 5xDUP1 create this

[addr_dep 0 0 0 0 0] = SWAP5 (1st <=> 6th) creates this

[gas_left addr_dep 0 0 0 0 0] = GAS

We know that CALL function has to return 0 because subsequent instructions compare 00 = 00 if the JUMPI instruction is to succeed.

Reusing the previous example's answer lets us make a contract that will return 01 which is the OPCODE for ADD, and since there are no items on the stack, it will REVERT, thereby making the result of CALL = 0, which is what we want.

60016000526001601ff3 is the answer

### 9

[03 call_data_size] we need to make call_data_size more than 3 the JUMPI works as it should

next, we need to make it so that while being greater than 03 bytes (so 04 and above) CALLDATASIZE \* CALLVALUE must equal 08

For this CALLDATA of 0x00000001 is 4 bytes, multiplied by 2 CALLVALUE which returns 8. Since 8 = 8, all the subsequent instructions give the desired result.

### 10

0x000000000001
15
https://www.evm.codes/playground?fork=merge&callValue=15&unit=Wei&callData=0x000000000001&codeType=Bytecode&code='38349011600857FD5B3661000390061534600A0157FDFDFDFD5B00'_