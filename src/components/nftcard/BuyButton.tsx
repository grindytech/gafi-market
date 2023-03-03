import {
  Box,
  BoxProps,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import { useBalanceOf } from "../../connectWallet/useBalanceof";
import { MAX_CONTRACT_INT } from "../../constants";
import erc20Contract from "../../contracts/erc20.contract";
import mpContract from "../../contracts/marketplace.contract";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import useSwal from "../../hooks/useSwal";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { selectProfile } from "../../store/profileSlice";
import {
  convertToContractValue,
  getNftImageLink,
  numeralFormat,
} from "../../utils/utils";
import { ImageWithFallback } from "../LazyImage";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";

export default function BuyButton({
  nft,
  children,
  onSuccess,
  ...rest
}: BoxProps & { nft: NftDto; onSuccess?: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

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
            <BuyPopup nft={nft} onClose={onClose} onSuccess={onSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const BuyPopup = ({
  nft,
  onSuccess,
  onClose,
}: {
  nft: NftDto;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const { swAlert } = useSwal();
  const router = useRouter();
  const { chainInfo } = useGetChainInfo({ chainId: nft?.chain });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: nft.sale.paymentToken,
  });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: nft?.nftCollection,
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
    decimal: paymentInfo?.decimals,
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
        user
      );
      if (Number(allowance) < Number(approvePrice)) {
        await erc20Contract.approve(
          paymentInfo.contractAddress,
          chainInfo?.mpContract,
          user,
          MAX_CONTRACT_INT
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
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: !!paymentInfo,
    paymentSymbol: paymentInfo?.symbol,
  });
  return (
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
        <ImageWithFallback
          w="300px"
          src={
            nft.image ? getNftImageLink(nft.id, 600) : collectionInfo?.avatar
          }
        />
      </Box>

      <VStack spacing={2} p={1} w="full" fontWeight="semibold">
        <HStack alignItems="start" w="full" justifyContent="space-between">
          <Text>Price</Text>
          <VStack spacing={0} alignItems="end">
            <Text w="full">
              {nft.sale.price} {paymentInfo?.symbol}
            </Text>
            <Text textAlign="right" fontSize="xs" color="gray.500">
              ~{prefix}
              {numeralFormat(Number(nft.sale.price) * priceAsUsd)}
            </Text>
          </VStack>
        </HStack>
      </VStack>
      <HStack w="full" justifyContent="center">
        <SwitchNetworkButton symbol={chainInfo?.symbol} name={chainInfo?.name}>
          <PrimaryButton
            disabled={loading || balance < nft.sale.price || loadingBalance}
            isLoading={loading}
            onClick={buyNftHandle}
            w="full"
          >
            {balance < nft.sale.price ? "Insufficient balance" : "Confirm"}
          </PrimaryButton>
        </SwitchNetworkButton>
      </HStack>
    </VStack>
  );
};
