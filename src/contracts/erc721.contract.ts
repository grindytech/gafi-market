import { default as mpContractAbi } from "./abi/erc721.abi.json";
import { web3Inject } from ".";
import { AbiItem } from "web3-utils";

const erc721 = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(mpContractAbi as AbiItem[], address);
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
