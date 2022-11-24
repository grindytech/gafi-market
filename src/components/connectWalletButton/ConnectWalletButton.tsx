import {
  Button,
  ButtonProps,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useConnectWallet, Wallet } from "../../connectWallet/useWallet";
import { Icons } from "../../images";
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
      <Button
        onClick={onOpen}
        variant="solid"
        {...rest}
        colorScheme="primary"
        bg="primary.500"
        // borderColor="primary.200"
        color="gray.50"
      >
        Connect to wallet
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent mx={3} textAlign="center">
          <ModalHeader>Connect wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody py="5">
            <VStack>
              <Button
                variant="outline"
                onClick={async () => {
                  onClose();
                  await connect(Wallet.METAMASK);
                }}
                w="full"
                leftIcon={
                  <Icon w="32px" h="32px">
                    <Icons.Metamask />
                  </Icon>
                }
              >
                Metamask
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  onClose();
                  await connect(Wallet.WALLET_CONNECT);
                }}
                w="full"
                leftIcon={
                  <Icon w="32px" h="32px">
                    <Icons.Walletconnect />
                  </Icon>
                }
              >
                Walletconnect
              </Button>
            </VStack>
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

export default ConnectWalletButton;
