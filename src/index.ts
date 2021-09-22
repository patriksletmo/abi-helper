import Web3 from "web3";
import prompt from "prompt";
import fetch from "node-fetch";

prompt.start();

function logIndented(message: string) {
  const prefix = " ".repeat(2);
  console.log(
    prefix + message
      .split("\n")
      .map((line) => prefix + line)
      .join("\n")
      .trim()
  );
}

async function main() {
  const { contractAddress } = await prompt.get(["contractAddress"]);

  console.log();
  console.log(`Fetching ABI for ${contractAddress}...`);
  const response = await fetch(`https://songbird-explorer.flare.network/api?module=contract&action=getabi&address=${contractAddress}`);
  if (!response.ok) {
    throw new Error(`Failed to find contract ABI (${response.status})`);
  }

  const json = await response.json();
  if (json.status !== "1") {
    throw new Error(`Failed to find contract ABI`);
  }

  const abi = JSON.parse(json.result);
  console.log("Found ABI for contract!");
  console.log();

  const { data } = await prompt.get(["data"]);
  if (typeof data !== "string") {
    throw new Error("Entered data is not a string");
  }

  const signature = data.substr(0, 10).toLowerCase();
  const methodArgs = "0x" + data.substr(10);

  const web3 = new Web3();
  for (const candidate of abi) {
    const candidateSignature = web3.eth.abi.encodeFunctionSignature(candidate);
    if (candidateSignature === signature) {
      const decodedArgs = web3.eth.abi.decodeParameters(candidate.inputs || [], methodArgs);

      console.log();
      console.log(`Method Name: ${candidate.name}`);
      console.log("Parameters:");

      for (const [key, value] of Object.entries(decodedArgs)) {
        if (key === "__length__") {
          continue;
        }

        if (!isNaN(parseInt(key, 10))) {
          continue;
        }

        logIndented(`${key}: ${JSON.stringify(value, null, 2)}`);
      }
    }
  }
}

main().catch(console.error);
