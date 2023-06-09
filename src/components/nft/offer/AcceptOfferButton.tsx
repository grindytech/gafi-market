import {
  Box,
  Button,
  ButtonProps,
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
import { useState } from "react";
import { useSelector } from "react-redux";
import { useBalanceOf } from "../../../connectWallet/useBalanceof";
import erc721Contract from "../../../contracts/erc721.contract";
import mpContract from "../../../contracts/marketplace.contract";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../../hooks/useGetSystemInfo";
import useSwal from "../../../hooks/useSwal";
import { useTokenUSDPrice } from "../../../hooks/useTokenUSDPrice";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { OfferDto } from "../../../services/types/dtos/Offer.dto";
import { selectProfile } from "../../../store/profileSlice";
import {
  convertToContractValue,
  getNftImageLink,
  numeralFormat,
} from "../../../utils/utils";
import { ImageWithFallback } from "../../LazyImage";
import PrimaryButton from "../../PrimaryButton";
import SwitchNetworkButton from "../../SwitchNetworkButton";

export default function AcceptOfferButton({
  offer,
  nft,
  children,
  onSuccess,
  ...rest
}: ButtonProps & { nft: NftDto; offer: OfferDto; onSuccess?: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
        {...rest}
      >
        {children}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <AcceptOfferPopup
              nft={nft}
              offer={offer}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const AcceptOfferPopup = ({
  offer,
  nft,
  onClose,
  onSuccess,
}: {
  offer: OfferDto;
  nft: NftDto;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const { swAlert } = useSwal();
  const [marketFee, setMarketFee] = useState(0.05);
  const [collectionOwnerFee, setCollectionOwnerFee] = useState(0.0);
  const { chainInfo } = useGetChainInfo({ chainId: nft?.chain });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: offer.paymentToken,
  });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: nft?.nftCollection,
  });
  const { data: buyerBalance, isLoading: loadingBalance } = useBalanceOf({
    chainSymbol: chainInfo?.symbol,
    isNative: paymentInfo?.isNative,
    account: offer?.buyer?.address,
    decimal: paymentInfo?.decimals,
    tokenAddress: paymentInfo?.contractAddress,
  });
  const receive = () =>
    Number(offer.offerPrice) -
    Number(offer.offerPrice) * (marketFee + collectionOwnerFee);
  const acceptHandle = async () => {
    try {
      setLoading(true);
      await erc721Contract.approveForAll(
        nft.nftContract,
        user,
        chainInfo?.mpContract
      );
      const approvePrice = convertToContractValue({
        amount: offer.offerPrice,
        decimal: paymentInfo?.decimals,
      });
      await mpContract.matchOffer(
        {
          nftContract: nft.nftContract,
          ownerAddress: offer.buyer.address,
          paymentTokenAddress: paymentInfo?.contractAddress,
          price: approvePrice,
          saltNonce: String(offer.saltNonce),
          signature: offer.signature,
          tokenId: nft.tokenId,
          period: offer.period,
        },
        user,
        chainInfo?.mpContract
      );
      swAlert({
        title: "COMPLETE",
        text: `Transaction successfully!`,
        icon: "success",
      });
      onClose();
      onSuccess && onSuccess();
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
    enabled: !!offer?.paymentToken,
    paymentSymbol: paymentInfo?.symbol,
  });
  return (
    <VStack pt={5} px={5} w="full">
      <Heading fontSize="2xl">SELL NFT</Heading>
      <HStack spacing={0}>
        <Text>You are about sell your&nbsp;</Text>
        <Text color="gray">
          {nft.name} {nft.tokenId ? `#${nft.tokenId}` : ""}
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
          <Text>You will receive</Text>
          <VStack spacing={0} alignItems="end">
            <Text color="gray">
              {receive() || "--"}
              &nbsp;
              {paymentInfo?.symbol}
            </Text>
            {priceAsUsd && offer.offerPrice && (
              <Text fontSize="xs" color="gray.500">
                ~{prefix}
                {numeralFormat(receive() * priceAsUsd)}
              </Text>
            )}
          </VStack>
        </HStack>
      </VStack>
      <HStack w="full" justifyContent="center">
        <SwitchNetworkButton symbol={chainInfo?.symbol} name={chainInfo?.name}>
          <PrimaryButton
            disabled={buyerBalance < offer.offerPrice || loadingBalance}
            isLoading={loading}
            onClick={acceptHandle}
            w="full"
          >
            {buyerBalance < offer.offerPrice
              ? "The buyer's account does not have sufficient funds to make an offer"
              : "Confirm"}
          </PrimaryButton>
        </SwitchNetworkButton>
      </HStack>
    </VStack>
  );
};
