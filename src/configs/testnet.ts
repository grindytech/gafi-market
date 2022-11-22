import { Configs } from ".";
import Web3 from "web3";
const configs: Configs = {
  NETWORKS: {
    BSC: {
      chainIdNumber: 97,
      chainId: Web3.utils.numberToHex(97),
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
      chainName: "BSC Test Net",
      blockExplorerUrls: ["https://testnet.bscscan.com"],
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      wrapToken: {
        contract: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
        name: "WBNB",
        symbol: "WBNB",
      },
    },
    DOS: {
      chainIdNumber: 1311,
      chainId: Web3.utils.numberToHex(1311),
      rpcUrls: ["https://test.doschain.com/jsonrpc"],
      chainName: "DOS",
      blockExplorerUrls: ["https://test-explorer.doschain.com/"],
      nativeCurrency: {
        name: "DOS Test Net",
        symbol: "DOS",
        decimals: 18,
      },
    },
  },
  DEFAULT_CHAIN: "BSC",
  API_URL: "https://mpapi-testnet.heroesempires.com",
};
export default configs;
