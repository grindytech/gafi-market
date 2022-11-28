import { client } from "./client";
import { BaseResult } from "./types/dtos/BaseResult";
import { HashMessageDto } from "./types/dtos/HashMessageDto";
import { NftDto } from "./types/dtos/Nft.dto";
import { PaginationDto } from "./types/dtos/PaginationDto";
import { CreateOfferParams } from "./types/params/CreateOfferParams";
import { GetHashMessage } from "./types/params/GetHashMessage";
import { GetNfts } from "./types/params/GetNfts";
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
  return await client.post(`/market/api/nft/${id}/offer`, body);
};
const cancelOffer = async (id: string): Promise<BaseResult<string>> => {
  return await client.post(`/market/api/nft/${id}/offer/cancel`);
};
export default {
  getNfts,
  getNft,
  getNftHashMessage,
  createSale,
  cancelSale,
  createOffer,
  cancelOffer,
};
