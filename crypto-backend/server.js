// Preliminary Steps :-
// 1) Deploy DCA contract
// 2) Transfer some usdc to DCA

const {ethers} = require("ethers");
require('dotenv').config();

const INFURA_PROVIDER = process.env.INFURA_API_KEY;
const cl = console.log.bind(console);  // when we want to attach any function with the object wo we use a methods call, apply and bind . Here we will use the bind method bc we have to bind the function on the object all work goes same for call and apply but in bind we can store them into separate variable and whenever we need it so we call them;

const budget = 1000 * (10**6);  // 1000 usdc  but convert it into 6 decimal place
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";  // you can find the usdc address on etherscan.io ; This is token address that is deployed publically
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const DCA_ADDRESS = "0x...";

const init = async () => {
    try {
    // 1. Connect to the blockchain using ethers and infura (Blockchain API is a service used to access the ethereum blockchain by becoming the ethereum node);
    const provider = new ethers.JsonRpcProvider(INFURA_PROVIDER);
    // Create a wallet instance from private key
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Create a signer instance
    const signer = wallet.connect(provider);


    // 2. Create object to interact with Uniswap, using ethers
    const router = new ethers.Contract(
        ROUTER_ADDRESS,  // UniswapV2Router02 is deployed at 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D on the Ethereum mainnet ; refer :- https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02
        [" function getAmountsOut(uint amountIn, address[] memory path)  public view returns (uint[] memory amounts)"],  // ABI
        provider
        );  
    

    // 3. Get current price of ether and set our tolerance (slippage)
        const amountsOut = await router.getAmountsOut(budget, [USDC_ADDRESS, WETH_ADDRESS]);
        const ethMin = amountsOut[1] * BigInt(95) / BigInt(100);
        const block = await provider.getBlock("latest");
        const timeLimit = block.timestamp + (60 * 10);  // This will work as the deadline
        cl(timeLimit);


    // 4. Create object to interact with DCA smart contract , using ethers
    // create a signer 
    const DCA_Contract = new ethers.Contract(
        DCA_ADDRESS, 
        ["function invest(uint ethMin, uint deadline) external"],  // ABI
        signer  // we need a signer for the write operations on to the blockchain 
        );


    // 5. Send a tx to execute invest()
        const tx = await DCA_Contract.invest(ethMin, timeLimit)
        await tx.wait();

    } catch (error) {
        console.error(error);
    }
}


init();

// setInterval(init, 86400 * 30 * 1000);   // 86400 * 1000 * 30 = (seconds in a day) * (milliseconds per second) * (number of days) ; 1sec = 1000ms