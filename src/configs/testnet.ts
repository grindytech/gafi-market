import Web3 from "web3";
import { Configs } from ".";
const configs: Configs = {
  NETWORKS: {
    BSC: {
      chainId: Web3.utils.numberToHex(97),
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
      chainName: "BSC Test Net",
      blockExplorerUrls: ["https://testnet.bscscan.com"],
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
    },
    DOS: {
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
  API_URL: "https://test-v1.overmint.io/",
  DOS_SYMBOL: "DOS",
  DOS_FORWARDER_CONTRACT: "0x337c38208357D61Ce83E613F1E561fA67741E3cF",
  DOS_GAS_LESS_URL: "ws://13.214.143.14:8999/",
};
export default configs;
