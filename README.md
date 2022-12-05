# README

This project contains a Solidity contract named AlarmClock. The contract allows for funds to be withdrawn only by the owner or after a specified timeout. The timeout can be set and postponed by the owner.

The contract was created by chatGPT, a large language model trained by OpenAI. It is intended to provide a simple example of how to implement a timeout in a Solidity contract.

To use the contract, deploy it on the Ethereum blockchain using the provided deployment script, and call the setTimeout and postponeTimeout functions as needed to manage the timeout. Once the timeout has passed, anyone can call the withdraw function to withdraw all the funds from the contract.

The project also includes TypeScript type definitions for the contract, as well as example tests that can be run using Hardhat and ethers.js.

Please note that this contract and associated project are for educational purposes only and have not been thoroughly tested. They should not be used in production without further testing and modifications.

# GPT alarm clock

Instructions

```
Write a solidity contract with a timeout. Anyone can withdraw all the funds after the timeout. Before the timeout only the owner can withdraw the funds.
There is a function to set the timeout.
There is a function to postpone the timeout by 24 hours.
Initial timeout is 24 hours from deployment
```

```
Replace now with block.timestamp
```

```
Repalce contract name with AlarmClock
```

```
Write a README describing a project with this contract. Explain it was created by chatGP
```

```
write a deployment script in typescript for the contract to the ETHEREUM_RPC_URL provider, using ethers.js
```
