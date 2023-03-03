import { useQuery } from "react-query";
import Web3 from "web3";
import configs from "../configs";
import { getNativeBalance } from "../contracts";
import erc20Contract from "../contracts/erc20.contract";

export type BalanceOfProps = {
  account?: string;
  tokenAddress?: string;
  isNative: boolean;
  chainSymbol: string;
  decimal?: number;
};
export function useBalanceOf({
  account,
  chainSymbol,
  tokenAddress,
  decimal,
  isNative,
}: BalanceOfProps) {
  const query = useQuery(
    ["useBalanceOf", chainSymbol, tokenAddress, isNative, account],
    async () => {
      let balance = 0;
      const network = configs.NETWORKS[chainSymbol];
      const w3 = new Web3(network.rpcUrls[0]);
      if (isNative) {
        balance = await getNativeBalance(account, w3, decimal);
      } else {
        balance = await erc20Contract.getErc20Balance(
          account,
          tokenAddress,
          w3,
          decimal
        );
      }
      return balance;
    },
    { enabled: !!account && !!chainSymbol && !!tokenAddress }
  );
  return query;
}
