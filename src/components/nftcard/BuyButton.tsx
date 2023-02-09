import {
  Box,
  BoxProps,
  Button,
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
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import configs from "../../configs";
import { useBalanceOf } from "../../connectWallet/useBalanceof";
import erc20Contract from "../../contracts/erc20.contract";
import mpContract from "../../contracts/marketplace.contract";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
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
}: BoxProps & { nft: NftDto; onSuccess?: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const { swAlert } = useSwal();
  const router = useRouter();
  const { chainInfo } = useGetChainInfo({ chainId: nft?.chain });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: nft.sale.paymentToken,
  });
  const {
    data: balance,
    refetch: refetchBalance,
    isLoading: loadingBalance,
    isFetching: fetchingBalance,
  } = useBalanceOf({
    account: user,
    chainSymbol: chainInfo?.symbol,
    tokenAddress: paymentInfo?.contractAddress,
    isNative: paymentInfo?.isNative,
  });

  const buyNftHandle = async () => {
    try {
      setLoading(true);
      const approvePrice = convertToContractValue({
        amount: nft.sale.price,
        decimal: paymentInfo?.decimals,
      });
      const allowance = await erc20Contract.getAllowance(
        paymentInfo?.contractAddress,
        chainInfo?.mpContract,
        user,
        chainInfo.symbol
      );
      if (Number(allowance) < Number(approvePrice)) {
        await erc20Contract.approve(
          paymentInfo.contractAddress,
          chainInfo?.mpContract,
          user,
          approvePrice
        );
      }
      await mpContract.matchTransaction(
        {
          nftContract: nft.nftContract,
          ownerAddress: nft.owner.address,
          paymentTokenAddress: paymentInfo.contractAddress,
          price: approvePrice,
          saltNonce: nft.sale.saltNonce,
          signature: nft.sale.signedSignature,
          tokenId: nft.tokenId,
          period: nft.sale.period,
        },
        user,
        chainInfo?.mpContract
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
      }).then(({ isConfirmed }) => {
        if (isConfirmed) router.push("/profile");
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
      <Countdown
        date={nft.sale.startTime}
        renderer={({ hours, minutes, seconds, completed }) => {
          if (completed) {
            return (
              <Box
                onClick={(e) => {
                  e.preventDefault();
                  onOpen();
                }}
                {...rest}
              >
                {children}
              </Box>
            );
          }
          return (
            <Box {...rest}>
              Listing {hours ? hours : ""}:
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </Box>
          );
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <VStack pt={5} px={5} w="full">
              <Heading fontSize="2xl">BUY NFT</Heading>
              <HStack justifyContent="center" spacing={0}>
                <Text w="full" textAlign="center">
                  You are about buy{" "}
                  <b>
                    {nft.name} {nft.tokenId ? `#${nft.tokenId}` : ""}
                  </b>
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
                    {nft.sale.price} {paymentInfo?.symbol}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <HStack w="full" justifyContent="center" px={5}>
              <SwitchNetworkButton
                symbol={chainInfo?.symbol}
                name={chainInfo?.name}
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
