import { useQuery } from "react-query";
import nftService from "../services/nft.service";
import systemService from "../services/system.service";
import { ChainDto } from "../services/types/dtos/ChainDto";
import { CollectionStatistic } from "../services/types/dtos/CollectionStatistic.dto";
import { NftCollectionDto } from "../services/types/dtos/NftCollectionDto";
import { PaymentToken } from "../services/types/dtos/PaymentToken.dto";

export const useGetChainInfo = ({ chainId }) => {
  const { data: chainInfo } = useQuery(
    ["ChainInfo", chainId],
    async (): Promise<ChainDto> => {
      if (typeof chainId == "object") return chainId;
      const chains = await systemService.getChainSupport();
      const chainInfo = chains.data.find((c) => c.id === chainId);
      return chainInfo;
    },
    {
      enabled: !!chainId,
    }
  );
  return { chainInfo };
};

export const useGetCollectionInfo = ({ collectionId }) => {
  const { data: collectionInfo } = useQuery(
    ["useGetCollectionInfo", collectionId],
    async (): Promise<NftCollectionDto> => {
      if (typeof collectionId == "object") return collectionId;
      const collection = await nftService.getNftCollection(collectionId);
      return collection?.data;
    },
    {
      enabled: !!collectionId,
    }
  );
  return { collectionInfo };
};

export const useGetPaymentTokenInfo = ({ paymentId }) => {
  const { data: paymentInfo } = useQuery(
    ["useGetPaymentTokenInfo", paymentId],
    async (): Promise<PaymentToken> => {
      if (typeof paymentId == "object") return paymentId;
      const payment = await systemService.getPaymentToken(paymentId);
      return payment?.data;
    },
    {
      enabled: !!paymentId,
    }
  );
  return { paymentInfo };
};

export const useGetCollectionStatistic = ({ collectionId }) => {
  const { data: collectionStatistic } = useQuery(
    ["useGetCollectionStatistic", collectionId],
    async (): Promise<CollectionStatistic> => {
      const collection = await nftService.getCollectionStatistic(collectionId);
      return collection?.data;
    },
    {
      enabled: !!collectionId,
    }
  );
  return { collectionStatistic };
};
