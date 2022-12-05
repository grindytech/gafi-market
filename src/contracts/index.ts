
import Web3 from "web3";

import { AbiItem } from "web3-utils";
import configs from "../configs";



const DEFAULT_CHAIN = configs.DEFAULT_CHAIN;

export enum Chain {
  BSC = "BSC",
  DOS = "DOS",
}

const PROVIDER = configs.DEFAULT_NETWORK().rpcUrls[0];
const NETWORKS = configs.NETWORKS;
export const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
export const web3Inject = web3;
export const WEB3_HTTP_PROVIDERS: { [n: string]: Web3 } = {};
for (const k of Object.keys(NETWORKS)) {
  const network = NETWORKS[k];
  const provider = new Web3.providers.HttpProvider(network.rpcUrls[0]);
  WEB3_HTTP_PROVIDERS[k] = new Web3(provider);
}

interface SafeAmountParams {
  str: string;
  decimal?: number;
  significant?: number;
}

export const safeAmount = ({
  str,
  decimal = 18,
  significant = 6,
}: SafeAmountParams) => {
  //* cut string to 6
  significant = significant || 6;
  //* cut string to
  if (significant === -1) {
    significant = decimal - 1;
  }
  if (str.length <= decimal - significant) return 0;
  const trimmedStr = str.slice(0, str.length - decimal + significant);
  return parseInt(trimmedStr) / 10 ** significant;
};

export const getNativeBalance = async (
  account: string,
  chain: string = DEFAULT_CHAIN
) => {
  const web3Http = WEB3_HTTP_PROVIDERS[chain];
  const bnbBalance = await web3Http.eth.getBalance(account);
  return safeAmount({ str: bnbBalance, decimal: 18 });
};
