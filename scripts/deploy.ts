import { AlarmClock } from '../typechain/AlarmClock';
import {ethers} from "ethers";

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function main() {
  // Deploy the contract
  const contract = await AlarmClock.deploy(wallet, {
    ...
  });

  // Set the initial timeout
  const timeout = await provider.getBlockNumber() + 24 * 60 * 60;
  await contract.setTimeout(timeout, { from: wallet });

  console.log(`Contract deployed at: ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
