import { useQuery } from "react-query";
import configs from "../configs";
import { getNativeBalance } from "../contracts";
import erc20Contract from "../contracts/erc20.contract";

export type BalanceOfProps = {
  account?: string;
  tokenAddress?: string;
  isNative: boolean;
  chainSymbol: string;
};
export function useBalanceOf({
  account,
  chainSymbol,
  tokenAddress,
  isNative,
}: BalanceOfProps) {
  const query = useQuery(
    ["useBalanceOf", chainSymbol, tokenAddress, isNative],
    async () => {
      if (!chainSymbol || !account || !tokenAddress) return;
      let balance = 0;
      if (!account) return 0;
      const network = configs.NETWORKS[chainSymbol];
      if (isNative) {
        balance = await getNativeBalance(account, network.rpcUrls[0]);
      } else {
        balance = await erc20Contract.getErc20Balance(
          account,
          tokenAddress,
          network.rpcUrls[0]
        );
      }
      return balance;
    },
    { enabled: !!account && !!chainSymbol && !!tokenAddress }
  );
  return query;
}
