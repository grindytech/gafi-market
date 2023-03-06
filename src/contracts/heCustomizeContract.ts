import { AbiItem } from "web3-utils";
import { web3Inject } from ".";
import { default as heroChestAbi } from "./abi/he/genesisChest.abi.json";
import { default as redeemAbi } from "./abi/he/redeem.abi.json";
import { default as skinChestAbi } from "./abi/he/skinChest.abi.json";

const redeemContract = (address: string, w3 = web3Inject) => {
  return new w3.eth.Contract(redeemAbi as AbiItem[], address);
};

const heroChestContract = (address: string, w3 = web3Inject) => {
  return new w3.eth.Contract(heroChestAbi as AbiItem[], address);
};
const skinChestContract = (address: string, w3 = web3Inject) => {
  return new w3.eth.Contract(skinChestAbi as AbiItem[], address);
};

const redeemNFTs = (
  contractAddress: string,
  nftContract: string,
  tokenIds: string[]
) => {
  const contract = redeemContract(contractAddress);
  return contract.methods.redeemAsset(nftContract, tokenIds);
};

const redeemHeroChest = (contractAddress: string, tokenId: string) => {
  const contract = heroChestContract(contractAddress);
  return contract.methods.burn(tokenId);
};

const redeemSkinChest = (contractAddress: string, tokenId: string) => {
  const contract = skinChestContract(contractAddress);
  return contract.methods.burn(tokenId);
};

export default {
  redeemNFTs,
  redeemHeroChest,
  redeemSkinChest,
};
