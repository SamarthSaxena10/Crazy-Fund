const hre = require("hardhat");

//0x5FbDB2315678afecb367f032d93F642f64180aa3

async function main() {
  const crowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const CrowdFunding = await crowdFunding.deploy();

  await CrowdFunding.deployed();
  console.log("CrowdFunding deployed to:", CrowdFunding.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
