import {
  Box,
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
import { useState } from "react";
import { useSelector } from "react-redux";
import erc721Contract from "../../../contracts/erc721.contract";
import mpContract from "../../../contracts/marketplace.contract";
import useSwal from "../../../hooks/useSwal";
import { useTokenUSDPrice } from "../../../hooks/useTokenUSDPrice";
import { Images } from "../../../images";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { OfferDto } from "../../../services/types/dtos/Offer.dto";
import { selectProfile } from "../../../store/profileSlice";
import { convertToContractValue, numeralFormat } from "../../../utils/utils";
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
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const { swAlert } = useSwal();
  const [marketFee, setMarketFee] = useState(0.05);
  const [collectionOwnerFee, setCollectionOwnerFee] = useState(0.0);
  const receive = () =>
    Number(offer.offerPrice) -
    Number(offer.offerPrice) * (marketFee + collectionOwnerFee);
  const acceptHandle = async () => {
    try {
      setLoading(true);
      await erc721Contract.approveForAll(
        nft.nftContract,
        user,
        nft.chain.mpContract
      );
      const approvePrice = convertToContractValue({
        amount: offer.offerPrice,
        decimal: offer.paymentToken.decimals,
      });
      await mpContract.matchOffer(
        {
          nftContract: nft.nftContract,
          ownerAddress: offer.buyer.address,
          paymentTokenAddress: offer.paymentToken.contractAddress,
          price: approvePrice,
          saltNonce: String(offer.saltNonce),
          signature: offer.signature,
          tokenId: nft.tokenId,
          period: offer.period,
        },
        user,
        nft.chain.mpContract
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
    paymentSymbol: offer?.paymentToken?.symbol,
  });
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
            <VStack pt={5} px={5} w="full">
              <Heading fontSize="2xl">SELL NFT</Heading>
              <HStack spacing={0}>
                <Text>You are about sell your&nbsp;</Text>
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
                <HStack
                  alignItems="start"
                  w="full"
                  justifyContent="space-between"
                >
                  <Text>You will receive</Text>
                  <VStack spacing={0} alignItems="end">
                    <Text color="gray">
                      {receive() || "--"}
                      &nbsp;
                      {offer.paymentToken?.symbol}
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
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <HStack w="full" justifyContent="center" px={5}>
              <SwitchNetworkButton
                symbol={nft.chain.symbol}
                name={nft.chain.name}
              >
                <PrimaryButton
                  isLoading={loading}
                  onClick={acceptHandle}
                  w="full"
                >
                  Confirm
                </PrimaryButton>
              </SwitchNetworkButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
