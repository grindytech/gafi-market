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
import mpContract from "../../contracts/marketplace.contract";
import useCustomToast from "../../hooks/useCustomToast";
import { Images } from "../../images";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { SaleType } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import { convertToContractValue } from "../../utils/utils";
import PrimaryButton from "../PrimaryButton";
import nftService from "../../services/nft.service";

export default function CancelBtn({
  nft,
  children,
  onSuccess,
  ...rest
}: ButtonProps & { nft: NftDto; onSuccess: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const { user } = useSelector(selectProfile);
  const cancelSale = async () => {
    try {
      setLoading(true);
      const contractValue = convertToContractValue({
        amount: nft.price,
        decimal: nft.sale.paymentToken.decimals,
      });
      const param = {
        contractPrice: contractValue,
        nftContract: nft.nftContract,
        ownerAddress: nft.owner.address,
        paymentContract: nft.sale.paymentToken.contractAddress,
        period: nft.sale.period,
        saleOption: SaleType.Sale,
        saltNonce: Number(nft.sale.saltNonce),
        signature: nft.sale.signedSignature,
        tokenId: Number(nft.tokenId),
      };
      await mpContract.cancelMessage(param, nft.chain.mpContract, user);
      await nftService.cancelSale(nft.id);
      toast.success("Cancel listing successfully.");
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
      <PrimaryButton
        colorScheme="red"
        bg="red.600"
        _hover={{ bg: "red.500" }}
        onClick={onOpen}
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
              <Heading fontSize="2xl">PUT ON SALE</Heading>
              <VStack spacing={0}>
                <Text>You are about cancel sell your&nbsp;</Text>
                <Text color="gray">
                  {nft.name} {nft.tokenId ? `#${nft.tokenId}` : ""}
                </Text>
              </VStack>
              <Box py={3}>
                <Image
                  w="300px"
                  src={nft.image}
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
              <PrimaryButton w="50%" isLoading={loading} onClick={cancelSale}>
                Confirm
              </PrimaryButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
