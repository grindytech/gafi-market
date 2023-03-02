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
  ASSETS_SERVICE: string;
  HE_HERO_CONTRACTS?: string[];
  HE_GEAR_CONTRACTS?: string[];
  HE_HERO_CHEST_CONTRACTS?: string[];
  HE_SKIN_CHEST_CONTRACTS?: string[];
};

const envConfigs =
  !process?.env?.REACT_APP_ENV || process?.env?.REACT_APP_ENV === "testnet"
    ? TestnetConfigs
    : MainnetConfigs;

const configs = {
  ...envConfigs,
  HE_HERO_CONTRACTS: [
    "0x4cd0ce1d5e10afbcaa565a0fe2a810ef0eb9b7e2",
    "0x01c04dd6cc9c167dafbca694d7f51d5f0f537aa8",
    "0xf9cdd083a090d4f0208445ce0845d73b8e3de499",
  ],
  HE_GEAR_CONTRACTS: [
    "0x08473a63b0f0cbabbdd3c846806531ec2c3c7371",
    "0x280da039b15e7ff9c2e2624c85e8376a1c46c184",
  ],
  HE_SKIN_CONTRACTS: [
    "0x909ec2fc55f8574b845005724d3f56375a329438",
    "0x2e18e0c4010e213db4ce05afc5fab3506c922b7f",
  ],
  HE_HERO_CHEST_CONTRACTS: [
    "0xe1f8ed3ff5690d1cfe3abcac1626f7ccb7c87c7c",
    "0x7a953f8189567be4c31c0c266f0535c5b62c1791",
  ],
  HE_SKIN_CHEST_CONTRACTS: [
    "0x02f9e15f32e98d7c074d7cd757bb16f5416dbb98",
    "0xb68f56091bc23ab89b6f1eb1f81ec3661628736a",
  ],
};
export default configs;
