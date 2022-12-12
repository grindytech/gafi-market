import { useMemo } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import nftService from "../services/nft.service";
import { selectSystem } from "../store/systemSlice";

const currencyPrefix = {
  usd: "$",
  vnd: "₫",
  brl: "R$",
  rub: "₽",
};

const useTokenUSDPrice = (options?: {
  enabled?: boolean;
  paymentSymbol?: string;
}) => {
  const { enabled = true } = options || {};
  const { fiat } = useSelector(selectSystem);
  const lowerKeyFiat = fiat.toLowerCase();
  const prefix = useMemo(() => (currencyPrefix as any)[lowerKeyFiat], [fiat]);
  const paymentSymbol = options?.paymentSymbol;

  const getPrice = async (symbol: string) => {
    if (!symbol) return 0;
    const rsp = await nftService.getPrice(symbol);
    return Number(rsp?.price);
  };
  const { data: priceAsUsd = 0, isLoading: isPriceAsUsdLoading } = useQuery(
    ["getPriceAsUsd", paymentSymbol, lowerKeyFiat],
    async () => getPrice(paymentSymbol),
    {
      enabled,
      staleTime: 60 * 1000,
    }
  );
  return {
    priceAsUsd,
    isPriceAsUsdLoading,
    prefix,
    getPrice,
  };
};

export { useTokenUSDPrice };
