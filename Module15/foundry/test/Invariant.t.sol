pragma solidity ^0.8.18;

contract IntroInvariant {
    bool public flag; //false

    function func_1() external {}

    function func_2() external {}

    function func_3() external {}

    function func_4() external {}

    function func_5() external {
        flag = true;
    }
}

import "forge-std/Test.sol";

contract IntoVariantTest is Test {
    IntroInvariant intro;

    function setUp() public {
        intro = new IntroInvariant();
    }

    function invariant_flag_is_always_false() public {
        assertTrue(!intro.flag());
    }
}
