import { ethers } from "hardhat";
import * as HealthChain from "../contracts/HealthChain.sol";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider?.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance!));

  const HealthChainFactory = await ethers.getContractFactory("HealthChain");
  const healthChain = await HealthChainFactory.deploy();

  await healthChain.waitForDeployment();

  console.log("HealthChain deployed to:", await healthChain.getAddress());
  console.log("Transaction hash:", healthChain.deploymentTransaction()?.hash);

  // Verify on Basescan (optional)
  // await run("verify:verify", {
  //   address: await healthChain.getAddress(),
  //   constructorArguments: [],
  // });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
