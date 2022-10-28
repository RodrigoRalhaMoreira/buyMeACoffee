// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function getBalance(address) {
    const balanceInString = String(await ethers.provider.getBalance(address));
    return String(ethers.utils.parseEther(balanceInString));
}

async function printBalances(addresses) {
    let index = 0;
    for (const address of addresses) {
        console.log(`Address ${index} balance: `, await getBalance(address));
        index++;
    }
}

async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipperName = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipperName}, (${tipperAddress}) said: "${message}"`);
    }
}

async function main() {
    // Get example accounts
    const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();
    //Get the contract to deploy and deploy
    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

    //Check balances before the coffee purchase
    const addresses = [owner.address, tipper.address, buyMeACoffee.address];
    console.log("== start ==");
    await printBalances(addresses);

    //Buy the owen a few coffees.
    const tip = { value: String(ethers.utils.parseEther("1")) };
    buyMeACoffee.connect(tipper).buyCoffee("RandomPerson1", "text of randomPerson1", tip);
    buyMeACoffee.connect(tipper2).buyCoffee("RandomPerson2", "text of randomPerson2", tip);
    buyMeACoffee.connect(tipper3).buyCoffee("RandomPerson3", "text of randomPerson3", tip);

    console.log("== bought cooffee ==");
    await printBalances(addresses);

    //withdraw tips to other address
    await buyMeACoffee.connect(owner).changeOwner(tipper.address);
    await buyMeACoffee.connect(owner).withdrawTips();

    console.log("== after withdraw ==");
    await printBalances(addresses);

    console.log("== memos ==");
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
