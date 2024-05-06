// SPDX-License-Identifier: UNLICENSIED
pragma solidity 0.8.25;

// It is a crypto trading bot or a dollar cost average app

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";  // Now we can interact with the IERC20 standard code 
import "https://github.com/Uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol";

contract DCA {
    IERC20 public usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);  // variable token for the erc-20 and initialize with the IERC20 usdc address
    IUniswapV2Router02 public router = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);   // the router points out the IUniswapV2Router02 interface and UniswapV2Router02 is deployed at 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D on the Ethereum mainnet, 
    address public owner; 
    uint public lastInvestment;  // 27349237492749 (timeStamp) 1 january 1970 ; you can refer the current timestamp here :- https://www.epochconverter.com/
    uint public budget = 1000 * (10 ** 6);  // 1000$ usdc is = 1000 * 1000000 (6 decimal)

    constructor(){
        owner = msg.sender;
    }

    // Function to send money to our smart contract
    function fund(uint amount) external {  
        // transfer usdc to the contract
        usdc.transferFrom(msg.sender, address(this), amount);  // address(this)  returns the smart contract address 
    
        // user is going to send directly fund to our smart contract
        // user => approve (DCA)
        // DCA => transferFrom()
    }

    function invest(uint ethMin, uint deadline) external {
        require(block.timestamp > lastInvestment + 30 days, "Invest too soon !");    // 8600 * 30
        address[] memory path = new address[](2);  // Initialize an array of length 2
        path[0] = address(usdc);
        path[1] = router.WETH();   // when we want to buy the ether we use the WETH function

        usdc.approve(address(router), budget);
        router.swapExactTokensForETH(
            budget,
            ethMin,
            path,
            address(this),  // we are gonna receive that ether 
            deadline
        );

        lastInvestment = block.timestamp;
    }   

    function withdraw(uint amount) external {
        require(owner == msg.sender, "Only owner can call");
        require(amount <= address(this).balance, "Balance too low");

        // .call{value: amount}(""): This part of the code is invoking the call function on the msg.sender address. The call function in Solidity is used to execute an external contract's function and optionally send some ether (ETH) along with the function call.
        msg.sender.call{value: amount}("");   // tranfer the token to our self
    }
}