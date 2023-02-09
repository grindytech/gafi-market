import MainnetConfigs from "./mainnet";
import TestnetConfigs from "./testnet";
export type Network = {
  chainId: string;
  rpcUrls: string[];
  chainName: string;
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export type Configs = {
  NETWORKS: { [n: string]: Network };
  API_URL: string;
  DOS_SYMBOL: string;
  DOS_FORWARDER_CONTRACT: string;
  DOS_GAS_LESS_URL: string;
};

const envConfigs =
  !process?.env?.REACT_APP_ENV || process?.env?.REACT_APP_ENV === "testnet"
    ? TestnetConfigs
    : MainnetConfigs;

const configs = {
  ...envConfigs,
};
export default configs;
