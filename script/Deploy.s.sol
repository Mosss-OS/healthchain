// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {HealthChain} from "../contracts/HealthChain.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        HealthChain healthChain = new HealthChain();
        console.log("HealthChain deployed at:", address(healthChain));

        vm.stopBroadcast();
    }
}