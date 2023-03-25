# Pausable or nonReentrant

Pausable is only necessary if there's a need to halt operations on functions by admin. Alternatively a state machine could introduce a non sequential (outside of normal operations) state as "Halted" and have the admin set it to that (which would require a modifier to make sure that the state is currently !halted (not halted) for operations to proceed)

Non-reentrant is useful for minting operations to make sure that the user doesn't use the same msg.value in a call to mint multiple NFTs, however in the contract implementation that uses the a specific tokenId for minting, a user cannot mint the same NFT ID more than once, so it doesn't provide a benefit (if, otherwise, the contract would be using an auto-incrementing ID counter, then nonReentrant would prove useful as a modifier)

# Optimization for Reentrancy Guard

Booleans are more expensive than uint256 or any type that takes up a full
word because each write operation emits an extra SLOAD to first read the
slot's contents, replace the bits taken up by the boolean, and then write
back. This is the compiler's defense against contract upgrades and
pointer aliasing, and it cannot be disabled.
The values being non-zero value makes deployment a bit more expensive,
but in exchange the refund on every call to nonReentrant will be lower in
amount. Since refunds are capped to a percentage of the total
transaction's gas, it is best to keep them low in cases like this one, to
increase the likelihood of the full refund coming into effect.
