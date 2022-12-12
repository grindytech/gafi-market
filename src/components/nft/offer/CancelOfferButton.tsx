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
import mpContract from "../../../contracts/marketplace.contract";
import useCustomToast from "../../../hooks/useCustomToast";
import { Images } from "../../../images";
import nftService from "../../../services/nft.service";
import { OfferDto } from "../../../services/types/dtos/Offer.dto";
import { SaleType } from "../../../services/types/enum";
import { selectProfile } from "../../../store/profileSlice";
import { convertToContractValue } from "../../../utils/utils";
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
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const { user } = useSelector(selectProfile);
  const cancelSale = async () => {
    try {
      setLoading(true);
      const contractValue = convertToContractValue({
        amount: offer.offerPrice,
        decimal: offer.paymentToken.decimals,
      });
      const param = {
        contractPrice: contractValue,
        nftContract: offer.nftContract,
        ownerAddress: offer.seller.address,
        paymentContract: offer.paymentToken.contractAddress,
        period: offer.period,
        saleOption: SaleType.MakeOffer,
        saltNonce: Number(offer.saltNonce),
        signature: offer.signature,
        tokenId: Number(offer.tokenId),
      };
      await mpContract.cancelMessage(param, offer.chain?.mpContract, user);
      await nftService.cancelOffer(offer.id);
      toast.success("Cancel offer successfully.");
      onClose();
      onSuccess && onSuccess();
    } catch (error) {
      console.error(error);
      error?.message && toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };
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
              <Heading fontSize="2xl">CANCEL OFFER</Heading>
              <VStack spacing={0}>
                <Text>Cancel offer for&nbsp;</Text>
                <Text color="gray">
                  {offer.name} {offer.tokenId ? `#${offer.tokenId}` : ""}
                </Text>
              </VStack>
              <Box py={3}>
                <Image
                  w="300px"
                  src={offer.image}
                  fallbackSrc={Images.Placeholder.src}
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <HStack w="full" justifyContent="center" px={5}>
              <Button w="50%" onClick={onClose}>
                Close
              </Button>
              <SwitchNetworkButton
                symbol={offer.chain?.symbol}
                name={offer.chain?.name}
              >
                <PrimaryButton w="50%" isLoading={loading} onClick={cancelSale}>
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
