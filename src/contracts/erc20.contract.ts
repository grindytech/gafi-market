import { default as erc20ContractAbi } from "./abi/erc20.abi.json";
import { safeAmount, web3Inject, WEB3_HTTP_PROVIDERS } from ".";
import { AbiItem } from "web3-utils";
import configs from "../configs";

const DEFAULT_CHAIN = configs.DEFAULT_CHAIN;

const erc20Contract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(erc20ContractAbi as AbiItem[], address);
};
const getErc20Balance = async (
  account: string,
  contractAddress: string,
  chain: string = DEFAULT_CHAIN,
  decimal = 18
) => {
  const web3Http = WEB3_HTTP_PROVIDERS[chain];
  const contract = new web3Http.eth.Contract(
    erc20ContractAbi as AbiItem[],
    contractAddress
  );
  let balance = await contract.methods.balanceOf(account).call();
  return safeAmount({ str: balance, decimal });
};

const getAllowance = async (
  erc20ContractAddress: string,
  contractAddress: string,
  user: string,
  web3 = web3Inject
) => {
  const contract = erc20Contract(erc20ContractAddress, web3);
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
