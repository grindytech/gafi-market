import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { web3Inject } from ".";
import configs from "../configs";
import { default as erc721ContractAbi } from "./abi/erc721.abi.json";

const erc721 = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(erc721ContractAbi as AbiItem[], address);
};

const isApproveForAll = async (
  nftContractAddress: string,
  user: string,
  marketplaceAddress: string
) => {
  const isApprovedForAll = await erc721(nftContractAddress)
    .methods.isApprovedForAll(user, marketplaceAddress)
    .call();
  return isApprovedForAll;
};
const approveForAll = async (
  nftContractAddress: string,
  user: string,
  marketplaceAddress: string
) => {
  const approved = await isApproveForAll(
    nftContractAddress,
    user,
    marketplaceAddress
  );
  if (!approved)
    await erc721(nftContractAddress)
      .methods.setApprovalForAll(marketplaceAddress, true)
      .send({ from: user });
};
const erc721Contract = {
  erc721,
  isApproveForAll,
  approveForAll,
};
export default erc721Contract;
