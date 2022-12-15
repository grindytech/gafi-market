import {
  Box,
  ButtonProps,
  Heading,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useBalanceOf } from "../../connectWallet/useBalanceof";
import { Chain } from "../../contracts";
import erc20Contract from "../../contracts/erc20.contract";
import mpContract from "../../contracts/marketplace.contract";
import useSwal from "../../hooks/useSwal";
import { Images } from "../../images";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { selectProfile } from "../../store/profileSlice";
import { convertToContractValue } from "../../utils/utils";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";

export default function BuyButton({
  nft,
  children,
  onSuccess,
  ...rest
}: ButtonProps & { nft: NftDto; onSuccess?: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const { swAlert } = useSwal();
  const router = useRouter();

  const {
    data: balance,
    refetch: refetchBalance,
    isLoading: loadingBalance,
    isFetching: fetchingBalance,
  } = useBalanceOf({
    account: user,
    chain: nft.chain.symbol.toUpperCase() as Chain,
    tokenAddress: nft.sale.paymentToken.contractAddress,
    isNative: false,
  });

  const buyNftHandle = async () => {
    try {
      setLoading(true);
      const approvePrice = convertToContractValue({
        amount: nft.sale.price,
        decimal: nft.sale.paymentToken.decimals,
      });
      const allowance = await erc20Contract.getAllowance(
        nft.sale.paymentToken.contractAddress,
        nft.chain.mpContract,
        user
      );
      if (Number(allowance) < Number(approvePrice)) {
        await erc20Contract.approve(
          nft.sale.paymentToken.contractAddress,
          nft.chain.mpContract,
          user,
          approvePrice
        );
      }
      await mpContract.matchTransaction(
        {
          nftContract: nft.nftContract,
          ownerAddress: nft.owner.address,
          paymentTokenAddress: nft.sale.paymentToken.contractAddress,
          price: approvePrice,
          saltNonce: nft.sale.saltNonce,
          signature: nft.sale.signedSignature,
          tokenId: nft.tokenId,
          period: nft.sale.period,
        },
        user,
        nft.chain.mpContract
      );
      onClose();
      onSuccess && onSuccess();
      swAlert({
        title: "COMPLETE",
        text: `Transaction successfully!`,
        icon: "success",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Inventory",
      }).then(() => {
        router.push("/profile");
      });
    } catch (error) {
      onClose();
      console.error(error);
      swAlert({
        title: "Failed",
        text:
          error.message && error.message.length < 200
            ? error.message
            : "Transaction failed!",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <PrimaryButton
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
        {...rest}
      >
        {children}
      </PrimaryButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <VStack pt={5} px={5} w="full">
              <Heading fontSize="2xl">BUY NFT</Heading>
              <HStack spacing={0}>
                <Text>You are about buy&nbsp;</Text>
                <Text color="gray">
                  {nft.name} {nft.tokenId ? `#${nft.tokenId}` : ""}
                </Text>
              </HStack>
              <Box py={3}>
                <Image
                  w="300px"
                  src={nft.image}
                  fallbackSrc={Images.Placeholder.src}
                />
              </Box>

              <VStack spacing={2} p={1} w="full" fontWeight="semibold">
                <HStack w="full" justifyContent="space-between">
                  <Text>Price</Text>
                  <Text>
                    {nft.sale.price} {nft.sale.paymentToken.symbol}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <HStack w="full" justifyContent="center" px={5}>
              <SwitchNetworkButton
                symbol={nft.chain.symbol}
                name={nft.chain.name}
              >
                <PrimaryButton
                  disabled={loading || balance < nft.sale.price}
                  isLoading={loading}
                  onClick={buyNftHandle}
                  w="full"
                >
                  {balance < nft.sale.price
                    ? "Insufficient balance"
                    : "Confirm"}
                </PrimaryButton>
              </SwitchNetworkButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
