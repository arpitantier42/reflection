export const env = {
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
  walletSocketUrl: process.env.REACT_APP_WALLET_EVENT_SOCKET_URL,
  rpcUrl: process.env.REACT_APP_WALLET_EVENT_SOCKET_URL,
  chainId: process.env.REACT_APP_CHAIN_ID,
  name: process.env.REACT_APP_NAME,
  currency: process.env.REACT_APP_CURRENCY,
  currencyDecimals: 18,
  txnExplorerUrl: process.env.REACT_APP_TXN_EXPLORER_URL,
};

export const messages = {
  Install_Wallet: `Wallet is not installed. Please install Wallet. Or refresh the browser`,
  Retrive_Meta_Account: `Cannot retrieve any account. Please refresh the browser`,
  Same_Network: `You are already on the ${env.chainName} network.`,
  Successfully_Switched: `You have successfully switched to ${env.chainName} network.`,
  Network_Added: `You have successfully switched to ${env.chainName} network.`,
  Network_Add_Error: `Error adding ${env.chainName} network: `,
};
