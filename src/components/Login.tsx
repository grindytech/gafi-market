import { VStack } from "@chakra-ui/react";
import ConnectWalletButton from "./connectWalletButton/ConnectWalletButton";

export default function Login() {
  return (
    <VStack py={10}>
      <ConnectWalletButton />
    </VStack>
  );
}
