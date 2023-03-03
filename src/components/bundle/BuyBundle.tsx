import {
  Box,
  BoxProps,
  Heading,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { get } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import configs from "../../configs";
import { useBalanceOf } from "../../connectWallet/useBalanceof";
import { MAX_CONTRACT_INT } from "../../constants";
import bundleContract from "../../contracts/bundle.contract";
import erc20Contract from "../../contracts/erc20.contract";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import useSwal from "../../hooks/useSwal";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import { BundleDto } from "../../services/types/dtos/BundleDto";
import { selectProfile } from "../../store/profileSlice";
import useCustomColors from "../../theme/useCustomColors";
import {
  convertToContractValue,
  getNftImageLink,
  numeralFormat,
} from "../../utils/utils";
import { MASKS } from "../nftcard/mask";
import NftCard from "../nftcard/NftCard";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";

export default function BuyBundle({
  bundle,
  children,
  onSuccess,
  ...rest
}: BoxProps & { bundle: BundleDto; onSuccess?: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { bgColor } = useCustomColors();
  return (
    <>
      <Countdown
        date={new Date(bundle.startTime)}
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
              Listing {hours ? hours + ":" : ""}
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </Box>
          );
        }}
      />
      <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalCloseButton />
          <ModalBody>
            <BuyBundlePopup
              bundle={bundle}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const BuyBundlePopup = ({ bundle, onClose, onSuccess }) => {
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const { swAlert } = useSwal();
  const router = useRouter();
  const { chainInfo } = useGetChainInfo({ chainId: bundle.chain });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: bundle.paymentToken,
  });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: bundle.nftCollection,
  });
  const {
    data: balance,
    refetch: refetchBalance,
    isLoading: loadingBalance,
    isFetching: fetchingBalance,
  } = useBalanceOf({
    account: user,
    chainSymbol: chainInfo.symbol,
    tokenAddress: paymentInfo?.contractAddress,
    isNative: paymentInfo?.isNative,
    decimal: paymentInfo?.decimals,
  });
  const buyNftHandle = async () => {
    try {
      setLoading(true);
      const approvePrice = convertToContractValue({
        amount: bundle.price,
        decimal: paymentInfo?.decimals,
      });
      const allowance = await erc20Contract.getAllowance(
        paymentInfo?.contractAddress,
        chainInfo?.bundleContract,
        user
      );
      if (Number(allowance) < Number(approvePrice)) {
        await erc20Contract.approve(
          paymentInfo.contractAddress,
          chainInfo?.bundleContract,
          user,
          MAX_CONTRACT_INT
        );
      }
      await bundleContract.match(chainInfo.bundleContract, user, {
        bundleId: bundle.bundleId,
        nftContract: collectionInfo.nftContract,
        paymentToken: paymentInfo.contractAddress,
        price: approvePrice,
        saltNonce: String(bundle.saltNonce),
        seller: bundle.seller.address,
        signedSignature: bundle.signedSignature,
        tokenIds: bundle.items.map((nft) => Number(nft.tokenId)).sort(),
      });
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
  const mask = MASKS(collectionInfo?.nftContract.toLowerCase());
  return (
    <VStack pt={5} px={5} w="full">
      <Heading fontSize="2xl">BUY NFT</Heading>
      <HStack spacing={0}>
        <Text>You are about buy {bundle.items.length} items</Text>
      </HStack>
      <Box rounded="xl" p={2} w="full" maxH={400} overflow="auto">
        <SimpleGrid
          justifyContent="center"
          w="full"
          columns={2}
          gap="15px"
          px={0}
        >
          {bundle.items.map((nft) => {
            return (
              <Link href={`/nft/${nft.id}`} target="_blank">
                <NftCard
                  image={getNftImageLink(nft.id, 600)}
                  mask={mask ? mask({ nft: nft }) : <></>}
                >
                  <HStack
                    alignItems="start"
                    w="full"
                    justifyContent="space-between"
                    p={2}
                  >
                    <VStack spacing={0} alignItems="start">
                      <Text noOfLines={1} fontSize="md" fontWeight="semibold">
                        {nft?.name || <>&nbsp;</>}
                      </Text>
                      <Text
                        noOfLines={1}
                        color="gray"
                        fontSize="xs"
                        fontWeight="semibold"
                      >
                        #{nft?.tokenId}
                      </Text>
                    </VStack>
                  </HStack>
                </NftCard>
              </Link>
            );
          })}
        </SimpleGrid>
      </Box>
      <VStack spacing={2} p={1} w="full" fontWeight="semibold">
        <HStack alignItems={"start"} w="full" justifyContent="space-between">
          <Text>Price</Text>
          <VStack spacing={0} alignItems="end">
            <Text>
              {bundle.price} {paymentInfo?.symbol}
            </Text>
            <Text textAlign="right" fontSize="xs" color="gray.500">
              ~{prefix}
              {numeralFormat(Number(bundle.price) * priceAsUsd)}
            </Text>
          </VStack>
        </HStack>
      </VStack>
      <HStack w="full" justifyContent="center">
        <SwitchNetworkButton symbol={chainInfo?.symbol} name={chainInfo?.name}>
          <PrimaryButton
            disabled={loading || balance < bundle.price || loadingBalance}
            isLoading={loading}
            onClick={buyNftHandle}
            w="full"
          >
            {balance < bundle.price ? "Insufficient balance" : "Confirm"}
          </PrimaryButton>
        </SwitchNetworkButton>
      </HStack>
    </VStack>
  );
};
