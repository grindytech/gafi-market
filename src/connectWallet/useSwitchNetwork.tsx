import { useSelector } from "react-redux";
import Web3 from "web3";
import configs from "../configs";
import { selectSystem } from "../store/systemSlice";
import { useConnectWallet, Wallet } from "./useWallet";

const useSwitchNetwork = () => {
  const { chainId, ethereum, connect, wallet } = useConnectWallet();
  const { chains } = useSelector(selectSystem);
  function isWrongNetwork(chainSymbol: string) {
    const chain = chains.find((c) => c.symbol === chainSymbol);
    return chain.chainNumber !== chainId;
  }
  function switchEthereumChain(changeChainId: number) {
    const chainIdHex = Web3.utils.toHex(changeChainId);
    return (
      ethereum?.request &&
      ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      })
    );
  }
  function addEthereumChain(params: any) {
    return (
      ethereum?.request &&
      ethereum.request({
        method: "wallet_addEthereumChain",
        params: params,
      })
    );
  }
  async function changeNetwork(chainSymbol: string) {
    const chain = chains.find((c) => c.symbol === chainSymbol);
    const network = configs.NETWORKS[chain.symbol];
    try {
      await switchEthereumChain(chain.chainNumber);
      connect(wallet || Wallet.METAMASK);
    } catch (err: any) {
      if (err.code === 4902) {
        addEthereumChain([network])?.then(() => {
          connect(wallet || Wallet.METAMASK);
        });
      }
    }
  }
  return { isWrongNetwork, changeNetwork };
};
export default useSwitchNetwork;
