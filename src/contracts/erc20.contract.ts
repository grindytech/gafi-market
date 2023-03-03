import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { safeAmount, web3Inject } from ".";
import configs from "../configs";
import { default as erc20ContractAbi } from "./abi/erc20.abi.json";

const erc20Contract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(erc20ContractAbi as AbiItem[], address);
};
const getErc20Balance = async (
  account: string,
  contractAddress: string,
  web3 = web3Inject,
  decimal = 18
) => {
  const contract = erc20Contract(contractAddress, web3);
  let balance = await contract.methods.balanceOf(account).call();
  return safeAmount({ str: balance, decimal });
};

const getAllowance = async (
  erc20ContractAddress: string,
  contractAddress: string,
  user: string
) => {
  const contract = erc20Contract(erc20ContractAddress);
  const allowance = await contract.methods
    .allowance(user, contractAddress)
    .call();
  return allowance;
};
const approve = async (
  paymentContract: string,
  marketplaceAddress: string,
  user: string,
  allowance: string
) => {
  return await erc20Contract(paymentContract)
    .methods.approve(marketplaceAddress, allowance)
    .send({ from: user });
};

export default {
  erc20Contract,
  getErc20Balance,
  getAllowance,
  approve,
};
