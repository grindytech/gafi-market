import { ethers } from "ethers";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { web3Inject } from ".";
import configs from "../configs";
import { wsCall } from "../utils/utils";
import { default as bundleContractAbi } from "./abi/bundleContract.abi.json";
import { getForwarderContract } from "./marketplace.contract";
import { signMetaTxRequest } from "./Signer";

const createBundleContract = (address: string, provider: any) => {
  const web3 = new Web3(provider);
  return new web3.eth.Contract(bundleContractAbi as AbiItem[], address);
};
const getBundleDOSContract = (address: string) => {
  let currentProvider = new ethers.providers.Web3Provider(
    web3Inject.currentProvider as any
  );
  return new ethers.Contract(address, bundleContractAbi, currentProvider);
};
type CancelBundleParam = {
  seller: string;
  nftContract: string;
  paymentTokenAddress: string;
  saltNonce: string;
  price: string;
  tokenIds: number[];
  bundleId: string;
  signedSignature: string;
};
const cancelBundle = async (
  address: string,
  user: string,
  param: CancelBundleParam
) => {
  const {
    bundleId,
    nftContract,
    paymentTokenAddress,
    price,
    saltNonce,
    seller,
    signedSignature,
    tokenIds,
  } = param;
  const contractParams = [
    [seller, nftContract, paymentTokenAddress],
    [price, saltNonce],
    tokenIds,
    bundleId,
    signedSignature,
  ];
  const chainId = await web3Inject.eth.getChainId();
  if (chainId === Number(configs.NETWORKS[configs.DOS_SYMBOL]?.chainId)) {
    const rs = await cancelBundleDOS(address, user, contractParams);
    return rs;
  } else {
    const contract = createBundleContract(address, web3Inject);
    const rs = await contract.methods
      .cancelListing(...contractParams)
      .send({ from: user });
    return rs;
  }
};
const cancelBundleDOS = async (
  address: string,
  user: string,
  params: any[]
) => {
  let currentProvider = new ethers.providers.Web3Provider(
    web3Inject.currentProvider as any
  );
  const mpContract = getBundleDOSContract(address);
  const forwarderContract = getForwarderContract(
    configs.DOS_FORWARDER_CONTRACT
  );
  const data = mpContract.interface.encodeFunctionData("cancelListing", params);
  const result = await signMetaTxRequest(currentProvider, forwarderContract, {
    to: address,
    from: user,
    data,
  });
  const apiCall = {
    event: "gasless",
    data: result,
  };
  await wsCall(configs.DOS_GAS_LESS_URL, apiCall);
};
type MatchBundleParam = {
  seller: string;
  nftContract: string;
  paymentToken: string;
  price: string;
  saltNonce: string;
  tokenIds: number[];
  bundleId: string;
  signedSignature: string;
};
const match = async (
  address: string,
  user: string,
  param: MatchBundleParam
) => {
  const {
    bundleId,
    nftContract,
    paymentToken,
    price,
    saltNonce,
    seller,
    signedSignature,
    tokenIds,
  } = param;
  const contractParams = [
    [seller, nftContract, paymentToken],
    [price, saltNonce],
    tokenIds,
    bundleId,
    signedSignature,
  ];
  const chainId = await web3Inject.eth.getChainId();
  if (chainId === Number(configs.NETWORKS[configs.DOS_SYMBOL]?.chainId)) {
    const rs = await matchDOS(address, user, contractParams);
    return rs;
  } else {
    const contract = createBundleContract(address, web3Inject);
    const rs = await contract.methods
      .matchTransaction(...contractParams)
      .send({ from: user });
    return rs;
  }
};
const matchDOS = async (address: string, user: string, params: any[]) => {
   let currentProvider = new ethers.providers.Web3Provider(
     web3Inject.currentProvider as any
   );
   const bundleContract = getBundleDOSContract(address);
   const forwarderContract = getForwarderContract(
     configs.DOS_FORWARDER_CONTRACT
   );
   const data = bundleContract.interface.encodeFunctionData(
     "matchTransaction",
     params
   );
   const result = await signMetaTxRequest(currentProvider, forwarderContract, {
     to: address,
     from: user,
     data,
   });
   const apiCall = {
     event: "gasless",
     data: result,
   };
   await wsCall(configs.DOS_GAS_LESS_URL, apiCall);
};

const bundleContract = {
  cancelBundle,
  match,
};
export default bundleContract;
