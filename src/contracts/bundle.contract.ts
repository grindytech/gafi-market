import { web3Inject } from ".";
import { default as bundleContractAbi } from "./abi/bundleContract.abi.json";
import { AbiItem } from "web3-utils";

const createBundleContract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(bundleContractAbi as AbiItem[], address);
};
type CancelBundleParam = {
  seller: string;
  nftContract: string;
  paymentTokenAddress: string;
  saltNonce: string;
  price: string;
  tokenIds: string[];
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
  const contract = createBundleContract(address);
  const rs = await contract.methods
    .cancelListing(
      [seller, nftContract, paymentTokenAddress],
      [price, saltNonce],
      tokenIds,
      bundleId,
      signedSignature
    )
    .send({ from: user });
  return rs;
};
type MatchBundleParam = {
  seller: string;
  nftContract: string;
  paymentToken: string;
  price: string;
  saltNonce: string;
  tokenIds: string[];
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
  const contract = createBundleContract(address);
  const rs = await contract.methods
    .matchTransaction(
      [seller, nftContract, paymentToken],
      [price, saltNonce],
      tokenIds,
      bundleId,
      signedSignature
    )
    .send({ from: user });
  return rs;
};

const bundleContract = {
  cancelBundle,
  match,
};
export default bundleContract;
