import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import Web3 from "web3";
import { ConnectWalletProvider } from "../connectWallet/useWallet";
import { accountService } from "../services/user.service";
import { LOCAL_PROFILE_KEY, login, logout } from "../store/profileSlice";

export default function W3Provider(props: any) {
  const dispatch = useDispatch();
  const onWalletConnect = async (account: string, w3: Web3) => {
    const localProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
    const { accessToken, user }: any = localProfile
      ? JSON.parse(localProfile)
      : {};
    if (user === account) {
      const payload: { exp: number } = jwtDecode(accessToken);
      if (payload.exp - 3600 * 0.1 > Date.now() / 1000) {
        dispatch(login({ accessToken, user }));
      }
    } else {
      const { data: sign } = await accountService.nonce({
        address: account.toLowerCase(),
      });
      const message = String(sign.nonce);
      const signature = await w3.eth.personal.sign(
        message,
        account.toLowerCase(),
        ""
      );
      const { data: loginData } = await accountService.login({
        address: account.toLowerCase(),
        signature,
      });
      dispatch(login({ accessToken: loginData.accessToken, user: account }));
    }
  };
  return (
    <ConnectWalletProvider
      onDisconnect={() => dispatch(logout())}
      onConnect={onWalletConnect}
    >
      {props.children}
    </ConnectWalletProvider>
  );
}
