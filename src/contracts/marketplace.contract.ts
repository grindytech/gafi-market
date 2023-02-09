import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { web3Inject } from ".";
import { NftDto } from "../services/types/dtos/Nft.dto";
import { PaymentToken } from "../services/types/dtos/PaymentToken.dto";
import { SaleType } from "../services/types/enum";
import { convertToContractValue } from "../utils/utils";
import { default as mpContractAbi } from "./abi/mpContract.abi.json";

const marketplaceContract = (address: string, provider: any) => {
  const w3 = new Web3(provider);
  return new w3.eth.Contract(mpContractAbi as AbiItem[], address);
};

type CancelMessageParam = {
  ownerAddress: string;
  nftContract: string;
  paymentContract: string;
  tokenId: number;
  contractPrice: string;
  saltNonce: number;
  period: number;
  saleOption: SaleType;
  signature: string;
};
const cancelMessage = async (
  params: CancelMessageParam,
  mpContract: string,
  user: string
) => {
  const contract = marketplaceContract(mpContract, web3Inject);
  const rs = await contract.methods
    .cancelMessage(
      [params.ownerAddress, params.nftContract, params.paymentContract],
      [
        params.tokenId,
        params.contractPrice,
        params.saltNonce,
        params.period,
        params.saleOption,
      ],
      params.signature
    )
    .send({ from: user });
  return rs;
};

type GetMessageParam = {
  nftAddress: string;
  tokenId: string;
  paymentTokenContract: string;
  price: string;
  saltNonce: number;
  period: number;
  option: SaleType;
};
const getMessageHash = async (param: GetMessageParam, mpContract: string) => {
  const contract = marketplaceContract(mpContract, web3Inject);
  const hashMessage = await contract.methods
    .getMessageHash(
      param.nftAddress,
      param.tokenId,
      param.paymentTokenContract,
      param.price,
      param.saltNonce,
      param.period,
      param.option
    )
    .call();
  return hashMessage;
};

type MatchTransactionParam = {
  ownerAddress: string;
  nftContract: string;
  paymentTokenAddress: string;
  tokenId: string;
  price: string;
  saltNonce: string;
  period: number;
  signature: string;
};
const matchTransaction = async (
  param: MatchTransactionParam,
  user: string,
  mpContract: string
) => {
  const contract = marketplaceContract(mpContract, web3Inject);
  await contract.methods
    .matchTransaction(
      [param.ownerAddress, param.nftContract, param.paymentTokenAddress],
      [param.tokenId, param.price, param.saltNonce, param.period],
      param.signature
    )
    .send({ from: user });
};
const matchBag = async (
  nfts: NftDto[],
  user: string,
  mpContract: string,
  paymentToken: PaymentToken
) => {
  const params = nfts.map((nft) => {
    const approvePrice = convertToContractValue({
      amount: nft.sale.price,
      decimal: paymentToken.decimals,
    });
    return [
      [nft.owner.address, nft.nftContract, paymentToken.contractAddress],
      [nft.tokenId, approvePrice, nft.sale.saltNonce, nft.sale.period],
      nft.sale.signedSignature,
    ];
  });
  const contract = marketplaceContract(mpContract, web3Inject);
  return await contract.methods.bag(params).send({ from: user });
};
const matchOffer = async (
  param: MatchTransactionParam,
  user: string,
  mpContract: string
) => {
  const contract = marketplaceContract(mpContract, web3Inject);
  await contract.methods
    .matchOffer(
      [param.ownerAddress, param.nftContract, param.paymentTokenAddress],
      [param.tokenId, param.price, param.saltNonce, param.period],
      param.signature
    )
    .send({ from: user });
};

const mpContract = {
  cancelMessage,
  marketplaceContract,
  getMessageHash,
  matchTransaction,
  matchOffer,
  matchBag,
};
export default mpContract;
