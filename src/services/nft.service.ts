import { client } from "./client";
import { BaseResult } from "./types/dtos/BaseResult";
import { HashMessageDto } from "./types/dtos/HashMessageDto";
import { NftDto } from "./types/dtos/Nft.dto";
import { NftCollectionDto } from "./types/dtos/NftCollectionDto";
import { NftHistoryDto } from "./types/dtos/NftHistory.dto";
import { OfferDto } from "./types/dtos/Offer.dto";
import { PaginationDto } from "./types/dtos/PaginationDto";
import { CreateOfferParams } from "./types/params/CreateOfferParams";
import { GetHashMessage } from "./types/params/GetHashMessage";
import { GetHistories } from "./types/params/GetHistories";
import { GetNftCollections } from "./types/params/GetNftCollections";
import { GetNfts } from "./types/params/GetNfts";
import { GetOffers } from "./types/params/GetOffers";
import { SaleRequest } from "./types/params/SaleRequest";

const getNfts = async (
  params: GetNfts
): Promise<BaseResult<PaginationDto<NftDto>>> => {
  return await client.post("/market/api/nft", params);
};
const getNft = async (id: string): Promise<BaseResult<NftDto>> => {
  return await client.get(`/market/api/nft/${id}`);
};
const getNftHashMessage = async (
  id: string,
  params: GetHashMessage
): Promise<BaseResult<HashMessageDto>> => {
  return await client.get(`/market/api/nft/${id}/hash-message`, { params });
};
const createSale = async (
  id: string,
  body: SaleRequest
): Promise<BaseResult<string>> => {
  return await client.post(`/market/api/nft/${id}/sale`, body);
};
const cancelSale = async (id: string): Promise<BaseResult<string>> => {
  return await client.delete(`/market/api/nft/${id}/sale`);
};
const createOffer = async (
  id: string,
  body: CreateOfferParams
): Promise<BaseResult<string>> => {
  return await client.post(`/market/api/offers/${id}/make`, body);
};
const cancelOffer = async (id: string): Promise<BaseResult<string>> => {
  return await client.post(`/market/api/offers/${id}/cancel`);
};
const acceptOffer = async (id: string): Promise<BaseResult<string>> => {
  return await client.post(`/market/api/offers/${id}/accept`);
};

const getOffers = async (
  params: GetOffers
): Promise<BaseResult<PaginationDto<OfferDto>>> => {
  return await client.get(`/market/api/offers`, { params });
};

const getNftCollections = async (
  params: GetNftCollections
): Promise<BaseResult<PaginationDto<NftCollectionDto>>> => {
  return await client.get("/market/api/nftcollections", { params });
};

const getNftCollection = async (
  id: string
): Promise<BaseResult<NftCollectionDto>> => {
  return await client.get(`/market/api/nftcollections/${id}`);
};

const getHistories = async (
  params: GetHistories
): Promise<BaseResult<PaginationDto<NftHistoryDto>>> => {
  return await client.get(`/market/api/histories`, { params });
};

const getPrice = async (symbol: string): Promise<{ price: string }> => {
  return await client.get(`/market/api/coin-price`, {
    params: {
      symbol,
    },
  });
};

const refreshMetaData = async (id: string) => {
  return await client.get(`/market/api/nft/${id}/sync-nft`);
};

export default {
  getNfts,
  getNft,
  getNftHashMessage,
  createSale,
  cancelSale,

  createOffer,
  cancelOffer,
  acceptOffer,

  getNftCollections,
  getNftCollection,

  getOffers,

  getHistories,

  getPrice,

  refreshMetaData,
};
