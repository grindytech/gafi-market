import Web3 from "web3";
import configs from "../configs";
interface SafeAmountParams {
  str: string;
  decimal?: number;
  significant?: number;
}
export const web3Inject = new Web3(
  Object.values(configs.NETWORKS)[0].rpcUrls[0]
);

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
  web3 = web3Inject,
  decimal = 18
) => {
  const bnbBalance = await web3.eth.getBalance(account);
  return safeAmount({ str: bnbBalance, decimal });
};
