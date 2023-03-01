import { AbiItem } from "web3-utils";
import { web3Inject } from ".";
import { default as heroChestAbi } from "./abi/he/genesisChest.abi.json";
import { default as redeemGearAbi } from "./abi/he/redeemGear.abi.json";
import { default as redeemHeroAbi } from "./abi/he/redeemHero.abi.json";
import { default as skinChestAbi } from "./abi/he/skinChest.abi.json";

const redeemHeroContract = (address: string, w3 = web3Inject) => {
  return new w3.eth.Contract(redeemHeroAbi as AbiItem[], address);
};

const redeemGearContract = (address: string, w3 = web3Inject) => {
  return new w3.eth.Contract(redeemGearAbi as AbiItem[], address);
};

const heroChestContract = (address: string, w3 = web3Inject) => {
  return new w3.eth.Contract(heroChestAbi as AbiItem[], address);
};
const skinChestContract = (address: string, w3 = web3Inject) => {
  return new w3.eth.Contract(skinChestAbi as AbiItem[], address);
};

const redeemGears = (contractAddress: string, tokenIds: string[]) => {
  const contract = redeemGearContract(contractAddress);
  return contract.methods.redeemGear(tokenIds);
};

const redeemHeros = (contractAddress: string, tokenIds: string[]) => {
  const contract = redeemHeroContract(contractAddress);
  return contract.methods.redeemHero(tokenIds);
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
  redeemGears,
  redeemHeros,
  redeemHeroChest,
  redeemSkinChest,
};
