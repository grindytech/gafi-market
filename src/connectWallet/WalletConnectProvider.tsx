import WalletConnectProvider from "@walletconnect/web3-provider";
import { walletConnectRpc } from "./connectors";

export const getWalletConnectProvider = () =>
  new WalletConnectProvider({
    rpc: walletConnectRpc,
  });
