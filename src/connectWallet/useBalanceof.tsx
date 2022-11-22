import { Chain, getErc20Balance, getNativeBalance } from "../contracts";
import { useQuery } from "react-query";

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
        balance = await getErc20Balance(account, tokenAddress, chain);
      }
      return balance;
    },
    { enabled: !!account && !!chain && !!tokenAddress }
  );
  return query;
}
