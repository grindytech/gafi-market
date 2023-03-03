import * as ethers from "ethers";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { web3Inject } from ".";
import configs from "../configs";
import { NftDto } from "../services/types/dtos/Nft.dto";
import { PaymentToken } from "../services/types/dtos/PaymentToken.dto";
import { SaleType } from "../services/types/enum";
import { convertToContractValue, wsCall } from "../utils/utils";
import { default as forwarderAbi } from "./abi/forwarderDOS.abi.json";
import { default as mpContractAbi } from "./abi/mpContract.abi.json";
import { signMetaTxRequest } from "./Signer";

const marketplaceContract = (address: string, provider: any) => {
  const w3 = new Web3(provider);
  return new w3.eth.Contract(mpContractAbi as AbiItem[], address);
};

const getMPContract = (address: string) => {
  let currentProvider = new ethers.providers.Web3Provider(
    web3Inject.currentProvider as any
  );
  return new ethers.Contract(address, mpContractAbi, currentProvider);
};

export const getForwarderContract = (address: string) => {
  let currentProvider = new ethers.providers.Web3Provider(
    web3Inject.currentProvider as any
  );
  return new ethers.Contract(address, forwarderAbi, currentProvider);
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
  const chainId = await web3Inject.eth.getChainId();
  const contractParams = [
    [params.ownerAddress, params.nftContract, params.paymentContract],
    [
      params.tokenId,
      params.contractPrice,
      params.saltNonce,
      params.period,
      params.saleOption,
    ],
    params.signature,
  ];
  if (chainId === Number(configs.NETWORKS[configs.DOS_SYMBOL]?.chainId)) {
    const rs = await cancelMessageDOS(contractParams, mpContract, user);
    return rs;
  } else {
    const contract = marketplaceContract(mpContract, web3Inject);
    const rs = await contract.methods
      .cancelMessage(...contractParams)
      .send({ from: user });
    return rs;
  }
};

const cancelMessageDOS = async (
  params: any[],
  mpContractAddress: string,
  user: string
): Promise<any> => {
  let currentProvider = new ethers.providers.Web3Provider(
    web3Inject.currentProvider as any
  );
  const mpContract = getMPContract(mpContractAddress);
  const forwarderContract = getForwarderContract(
    configs.DOS_FORWARDER_CONTRACT
  );
  const data = mpContract.interface.encodeFunctionData("cancelMessage", params);
  const result = await signMetaTxRequest(currentProvider, forwarderContract, {
    to: mpContractAddress,
    from: user,
    data,
  });
  const apiCall = {
    event: "gasless",
    data: result,
  };
  await wsCall(configs.DOS_GAS_LESS_URL, apiCall);
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
  const chainId = await web3Inject.eth.getChainId();
  const contractParams = [
    [param.ownerAddress, param.nftContract, param.paymentTokenAddress],
    [param.tokenId, param.price, param.saltNonce, param.period],
    param.signature,
  ];
  if (chainId === Number(configs.NETWORKS[configs.DOS_SYMBOL]?.chainId)) {
    await matchTransactionDOS(contractParams, user, mpContract);
  } else {
    const contract = marketplaceContract(mpContract, web3Inject);
    await contract.methods
      .matchTransaction(...contractParams)
      .send({ from: user });
  }
};

const matchTransactionDOS = async (
  contractParams: any[],
  user: string,
  mpContractAddress: string
) => {
  let currentProvider = new ethers.providers.Web3Provider(
    web3Inject.currentProvider as any
  );
  const mpContract = getMPContract(mpContractAddress);
  const forwarderContract = getForwarderContract(
    configs.DOS_FORWARDER_CONTRACT
  );
  const data = mpContract.interface.encodeFunctionData(
    "matchTransaction",
    contractParams
  );
  const result = await signMetaTxRequest(currentProvider, forwarderContract, {
    to: mpContractAddress,
    from: user,
    data,
  });
  const apiCall = {
    event: "gasless",
    data: result,
  };
  await wsCall(configs.DOS_GAS_LESS_URL, apiCall);
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
  const chainId = await web3Inject.eth.getChainId();
  if (chainId === Number(configs.NETWORKS[configs.DOS_SYMBOL]?.chainId)) {
    const rs = await matchBagDOS(params, user, mpContract);
    return rs;
  } else {
    const contract = marketplaceContract(mpContract, web3Inject);
    return await contract.methods.bag(params).send({ from: user });
  }
};
const matchBagDOS = async (
  params: any[],
  user: string,
  mpContractAddress: string
) => {
  const currentProvider = new ethers.providers.Web3Provider(
    web3Inject.currentProvider as any
  );
  const mpContract = getMPContract(mpContractAddress);
  const forwarderContract = getForwarderContract(
    configs.DOS_FORWARDER_CONTRACT
  );
  const data = mpContract.interface.encodeFunctionData("bag", [params]);
  const result = await signMetaTxRequest(currentProvider, forwarderContract, {
    to: mpContractAddress,
    from: user,
    data,
  });
  const apiCall = {
    event: "gasless",
    data: result,
  };
  await wsCall(configs.DOS_GAS_LESS_URL, apiCall);
};
const matchOffer = async (
  param: MatchTransactionParam,
  user: string,
  mpContract: string
) => {
  const chainId = await web3Inject.eth.getChainId();
  const params = [
    [param.ownerAddress, param.nftContract, param.paymentTokenAddress],
    [param.tokenId, param.price, param.saltNonce, param.period],
    param.signature,
  ];
  if (chainId === Number(configs.NETWORKS[configs.DOS_SYMBOL]?.chainId)) {
    const rs = await matchOfferDOS(params, user, mpContract);
    return rs;
  } else {
    const contract = marketplaceContract(mpContract, web3Inject);
    const rs = await contract.methods
      .matchOffer(...params)
      .send({ from: user });
    return rs;
  }
};

const matchOfferDOS = async (
  params: any[],
  user: string,
  mpContractAddress: string
) => {
  const currentProvider = new ethers.providers.Web3Provider(
    web3Inject.currentProvider as any
  );
  const mpContract = getMPContract(mpContractAddress);
  const forwarderContract = getForwarderContract(
    configs.DOS_FORWARDER_CONTRACT
  );

  const data = mpContract.interface.encodeFunctionData("matchOffer", params);
  const result = await signMetaTxRequest(currentProvider, forwarderContract, {
    to: mpContractAddress,
    from: user,
    data,
  });
  const apiCall = {
    event: "gasless",
    data: result,
  };
  await wsCall(configs.DOS_GAS_LESS_URL, apiCall);
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
