import TestnetConfigs from "./testnet";
import MainnetConfigs from "./mainnet";
export type Network = {
  chainId: string;
  chainIdNumber: number;
  rpcUrls: string[];
  chainName: string;
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  wrapToken?: {
    contract: string;
    name: string;
    symbol: string;
  };
};

export type Configs = {
  NETWORKS: { [n: string]: Network };
  DEFAULT_CHAIN: string;
  API_URL: string;
};

const envConfigs =
  !process?.env?.REACT_APP_ENV ||process?.env?.REACT_APP_ENV === "testnet"
    ? TestnetConfigs
    : MainnetConfigs;

const configs = {
  ...envConfigs,
  DEFAULT_NETWORK: () => envConfigs.NETWORKS[envConfigs.DEFAULT_CHAIN],
};
export default configs;
