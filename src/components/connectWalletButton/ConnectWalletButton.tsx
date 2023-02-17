import {
  ButtonProps,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  StackProps,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useConnectWallet, Wallet } from "../../connectWallet/useWallet";
import { ERROR_CODE } from "../../constants";
import { Icons } from "../../images";
import PrimaryButton from "../PrimaryButton";
import RequireWalletPopup from "../requireWalletPopup/RequireWalletPopup";
const ConnectWalletButton: React.FC<ButtonProps> = (props) => {
  const { connect } = useConnectWallet();
  const { ...rest } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRequireWallet,
    onOpen: onOpenRequireWallet,
    onClose: onCloseRequireWallet,
  } = useDisclosure();
  return (
    <>
      <PrimaryButton onClick={onOpen} {...rest}>
        Connect to wallet
      </PrimaryButton>
      <Modal
        size="sm"
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent mx={3} textAlign="center">
          <ModalHeader>Connect wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody py="5">
            <HStack w="full" justifyContent="center">
              <ConnectButton
                onClick={async () => {
                  onClose();
                  try {
                    await connect(Wallet.METAMASK);
                  } catch (error) {
                    console.log(error);
                    if (error.code === ERROR_CODE.WEB3_PROVIDER_NOTFOUND) {
                      onOpenRequireWallet();
                    }
                  }
                }}
              >
                <Icon w="62px" h="62px">
                  <Icons.Metamask />
                </Icon>
                <Text fontWeight="semibold">Metamask</Text>
              </ConnectButton>
              <ConnectButton
                onClick={async () => {
                  onClose();
                  await connect(Wallet.WALLET_CONNECT);
                }}
              >
                <Icon w="62px" h="62px">
                  <Icons.Walletconnect />
                </Icon>
                <Text fontWeight="semibold">Walletconnect</Text>
              </ConnectButton>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <RequireWalletPopup
        isOpen={isOpenRequireWallet}
        onClose={onCloseRequireWallet}
      />
    </>
  );
};

const ConnectButton = ({ children, ...rest }: StackProps) => {
  return (
    <VStack
      {...rest}
      transition="all ease 0.5s"
      w="full"
      p={3}
      cursor="pointer"
      _hover={{
        boxShadow: "md",
      }}
    >
      {children}
    </VStack>
  );
};

export default ConnectWalletButton;
