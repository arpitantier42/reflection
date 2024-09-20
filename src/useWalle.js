/**
 * Custom hook to handle wallet-related functionality.
 *
 * @returns {Object} An object containing the `isDisabled` state and the `addNetwork` function.
 *
 */
import { useState } from "react";
import { message } from "antd";
import detectEthereumProvider from "@metamask/detect-provider";
import { contractEvents } from "./contractHelper";
import { env, messages } from "./appconstants";

const useWallet = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  /**
   * Adds the network to the wallet.
   *
   * @returns {Promise<void>} A promise resolving when the network is added.
   *
   */
  const addNetwork = async (amount) => {
    try {
      const provider = await detectEthereumProvider();
      const address = window.ethereum.selectedAddress;
      const chainId = await provider.request({ method: "eth_chainId" });
      const ChainId = env.chainId;

      if (!chainId) {
        return message.info(messages.Retrive_Meta_Account);
      }

      if (chainId === ChainId) {
        const res = await contractEvents({ eventName: "reflect", amount });
        return res;
      } else {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ChainId }],
          });
          const res = await contractEvents({ eventName: "reflect", amount });
          return res;
        } catch (switchError) {
          return addChain(ChainId, provider, address, amount);
        }
      }
    } catch (error) {
      message.error(error?.message);
    }
  };

  const addChain = async (ChainId, provider, address, amount) => {
    try {
      debugger;
      const payload = {
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: ChainId, //chain id in hex
            chainName: env.name, //name of chain
            rpcUrls: [env.rpcUrl], //rpc url of chain, can add multiple, it supports https
            blockExplorerUrls: [
              env.txnExplorerUrl, //url to navigate on a platform where user can cross check its' tx
            ],
            nativeCurrency: {
              name: env.currency, //currency name
              symbol: env.currency, //currency symbol
              decimals: Number(env.currencyDecimals), //decimal value of currency
            },
          },
        ],
      };
      await provider.request(payload);
      const res = await contractEvents({ eventName: "reflect", amount });
      return res;
    } catch (error) {
      message.error(`${messages.Network_Add_Error}, ${error.message}`);
    }
  };

  return {
    isDisabled,
    addNetwork,
  };
};

export default useWallet;
