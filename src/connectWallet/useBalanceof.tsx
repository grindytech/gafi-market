import { Chain, getNativeBalance } from "../contracts";
import { useQuery } from "react-query";
import erc20Contract from "../contracts/erc20.contract";

export type BalanceOfProps = {
  chain?: Chain;
  account?: string;
  tokenAddress?: string;
  isNative: boolean;
};
export function useBalanceOf({
  account,
  chain,
  tokenAddress,
  isNative,
}: BalanceOfProps) {
  const query = useQuery(
    ["useBalanceOf", chain, chain, tokenAddress, isNative],
    async () => {
      if (!chain || !account || !tokenAddress) return;
      let balance = 0;
      if (!account) return 0;
      if (isNative) {
        balance = await getNativeBalance(account, chain);
      } else {
        balance = await erc20Contract.getErc20Balance(account, tokenAddress, chain);
      }
      return balance;
    },
    { enabled: !!account && !!chain && !!tokenAddress }
  );
  return query;
}
