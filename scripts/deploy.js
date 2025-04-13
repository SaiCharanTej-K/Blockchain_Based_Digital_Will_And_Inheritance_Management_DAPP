const hre = require("hardhat");

async function main() {
  const Will = await hre.ethers.getContractFactory("Will");
  const will = await Will.deploy(); // ✅ No constructor args
  await will.waitForDeployment();

  console.log("✅ Contract deployed to:", await will.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
