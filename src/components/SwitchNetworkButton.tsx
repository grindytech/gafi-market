import { Button, ButtonProps } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import useSwitchNetwork from "../connectWallet/useSwitchNetwork";
import { selectProfile } from "../store/profileSlice";
import ConnectWalletButton from "./connectWalletButton/ConnectWalletButton";

export default function SwitchNetworkButtonWrapper({
  symbol,
  name,
  children,
  ...rest
}: ButtonProps & {
  symbol: string;
  name: string;
}) {
  return (
    name &&
    symbol && (
      <SwitchNetworkButton name={name} symbol={symbol} {...rest}>
        {children}
      </SwitchNetworkButton>
    )
  );
}

function SwitchNetworkButton({
  symbol,
  name,
  children,
  ...rest
}: ButtonProps & {
  symbol: string;
  name: string;
}) {
  const { isWrongNetwork, changeNetwork } = useSwitchNetwork();
  const { isLoggedIn } = useSelector(selectProfile);
  return !isLoggedIn ? (
    <ConnectWalletButton w="full" />
  ) : isWrongNetwork(symbol.toUpperCase()) ? (
    <Button
      w="full"
      variant="solid"
      colorScheme="primary"
      bg="primary.500"
      color="gray.50"
      onClick={() => {
        changeNetwork(symbol.toUpperCase());
      }}
      {...rest}
    >
      Switch network to {name}
    </Button>
  ) : (
    <>{children}</>
  );
}
