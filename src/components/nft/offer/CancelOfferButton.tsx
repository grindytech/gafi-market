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
import mpContract from "../../../contracts/marketplace.contract";
import {
  useGetChainInfo,
  useGetPaymentTokenInfo,
} from "../../../hooks/useGetSystemInfo";
import useSwal from "../../../hooks/useSwal";
import nftService from "../../../services/nft.service";
import { OfferDto } from "../../../services/types/dtos/Offer.dto";
import { SaleType } from "../../../services/types/enum";
import { selectProfile } from "../../../store/profileSlice";
import { convertToContractValue, getNftImageLink } from "../../../utils/utils";
import { ImageWithFallback } from "../../LazyImage";
import PrimaryButton from "../../PrimaryButton";
import SwitchNetworkButton from "../../SwitchNetworkButton";

export default function CancelOfferButton({
  offer,
  children,
  onSuccess,
  ...rest
}: ButtonProps & {
  offer: OfferDto;
  onSuccess: () => void;
}) {
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
            <CancelOfferPopup
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

const CancelOfferPopup = ({ offer, onClose, onSuccess }) => {
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: offer?.paymentToken,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(selectProfile);
  const { swAlert } = useSwal();
  const { chainInfo } = useGetChainInfo({ chainId: offer?.chain });
  const cancelSale = async () => {
    try {
      setLoading(true);
      const contractValue = convertToContractValue({
        amount: offer.offerPrice,
        decimal: paymentInfo?.decimals,
      });
      const param = {
        contractPrice: contractValue,
        nftContract: offer.nftContract,
        ownerAddress: offer.seller.address,
        paymentContract: paymentInfo?.contractAddress,
        period: offer.period,
        saleOption: SaleType.MakeOffer,
        saltNonce: Number(offer.saltNonce),
        signature: offer.signature,
        tokenId: Number(offer.tokenId),
      };
      await mpContract.cancelMessage(param, chainInfo?.mpContract, user);
      await nftService.cancelOffer(offer.id);
      swAlert({
        title: "COMPLETE",
        text: `Cancel offer successfully!`,
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
  return (
    <VStack pt={5} px={5} w="full">
      <Heading fontSize="2xl">CANCEL OFFER</Heading>
      <VStack spacing={0}>
        <Text>Cancel offer for&nbsp;</Text>
        <Text color="gray">
          {offer.name} {offer.tokenId ? `#${offer.tokenId}` : ""}
        </Text>
      </VStack>
      <Box py={3}>
        <ImageWithFallback w="300px" src={getNftImageLink(offer.nft.id, 600)} />
      </Box>
      <HStack w="full" justifyContent="center">
        <Button w="50%" onClick={onClose}>
          Close
        </Button>
        <SwitchNetworkButton symbol={chainInfo?.symbol} name={chainInfo?.name}>
          <PrimaryButton w="50%" isLoading={loading} onClick={cancelSale}>
            Confirm
          </PrimaryButton>
        </SwitchNetworkButton>
      </HStack>
    </VStack>
  );
};
