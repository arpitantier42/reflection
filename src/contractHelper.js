import Web3 from "web3";
import * as contractAbi from "./contractabi.js";
import { env } from "./appconstants.js";

console.log({
  env: env?.walletSocketUrl,
  de: process.env.REACT_APP_WALLET_EVENT_SOCKET_URL,
});

export const wsProvider = new Web3.providers.HttpProvider(env?.walletSocketUrl);
export const web3 = new Web3(wsProvider);

const contractAddress = env?.contractAddress;
const contract = new web3.eth.Contract(contractAbi, contractAddress);

const baseEventStructure = async ({ eventName, amount }) => {
  const addresss = async () => {
    try {
      const fromAddress = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let address_from_metamask = fromAddress[0];
      return address_from_metamask;
    } catch (error) {
      console.error(error);
    }
  };
  const address = await addresss();
  const contractAddress = env?.contractAddress;

  try {
    const gasPrice = await web3?.eth?.getGasPrice();
    const nonce = await web3?.eth?.getTransactionCount(address);

    let txObject = null;
    switch (eventName) {
      case "reflect":
        txObject = await contract?.methods[eventName]();
        break;
      default:
        break;
    }
    const gasEstimate = "200"; //await txObject?.estimateGas({ from: address });

    const txdata = {
      from: address,
      to: contractAddress,
      gas: web3?.utils?.toHex(gasEstimate),
      gasPrice: web3?.utils?.toHex(gasPrice),
      nonce: web3?.utils?.toHex(nonce),
      data: txObject?.encodeABI(),
      value: amount
        ? parseInt(web3?.utils?.toWei(amount, "ether")).toString(16)
        : undefined,
    };

    const res = await window?.ethereum?.request({
      method: "eth_sendTransaction",
      params: [txdata],
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const contractEvents = ({ eventName, amount }) => {
  switch (eventName) {
    case "reflect":
      return baseEventStructure({
        eventName: "reflect",
        amount,
      });

    default:
      break;
  }
};

const waitForReceipt = async (transactionHash) => {
  try {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const receipt = await window.ethereum.request({
            method: "eth_getTransactionReceipt",
            params: [transactionHash],
          });
          console.log({ receipt, transactionHash });

          if (receipt) {
            if (receipt?.logs?.length) {
              clearInterval(interval);
              return resolve(receipt);
            } else {
              /* istanbul ignore next */
              clearInterval(interval);
              return reject("error");
            }
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 1000);
    });
  } catch (error) {
    /* istanbul ignore next */
    console.error(error);
  }
};
