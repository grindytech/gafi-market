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
import { useState } from "react";
import { useSelector } from "react-redux";
import mpContract from "../../contracts/marketplace.contract";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import useSwal from "../../hooks/useSwal";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { SaleType } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import { convertToContractValue, getNftImageLink } from "../../utils/utils";
import { ImageWithFallback } from "../LazyImage";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";

export default function CancelBtn({
  nft,
  children,
  onSuccess,
  ...rest
}: BoxProps & { nft: NftDto; onSuccess: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Box
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
        {...rest}
      >
        {children}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <CancelPopup nft={nft} onClose={onClose} onSuccess={onSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
const CancelPopup = ({
  nft,
  onClose,
  onSuccess,
}: {
  nft: NftDto;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(selectProfile);
  const { swAlert } = useSwal();
  const { chainInfo } = useGetChainInfo({ chainId: nft.chain });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: nft.sale.paymentToken,
  });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: nft?.nftCollection,
  });

  const cancelSale = async () => {
    try {
      setLoading(true);
      const contractValue = convertToContractValue({
        amount: nft.price,
        decimal: paymentInfo.decimals,
      });
      const param = {
        contractPrice: contractValue,
        nftContract: nft.nftContract,
        ownerAddress: nft.owner.address,
        paymentContract: paymentInfo.contractAddress,
        period: nft.sale.period,
        saleOption: SaleType.Sale,
        saltNonce: Number(nft.sale.saltNonce),
        signature: nft.sale.signedSignature,
        tokenId: Number(nft.tokenId),
      };
      await mpContract.cancelMessage(param, chainInfo?.mpContract, user);
      // try {
      //   await nftService.cancelSale(nft.id);
      // } catch (error) {
      //   console.error(error);
      // }
      onClose();
      onSuccess && onSuccess();
      swAlert({
        title: "Complete",
        text: "Cancel listing successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error(error);
      swAlert({
        title: "Failed",
        text:
          error.message && error.message.length < 200
            ? error.message
            : "Transaction failed!",
        icon: "error",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };
  return (
    <VStack pt={5} px={5} w="full">
      <Heading fontSize="2xl">CANCEL SALE</Heading>
      <VStack spacing={0}>
        <Text>You are about cancel sell your&nbsp;</Text>
        <Text color="gray">
          {nft.name} {nft.tokenId ? `#${nft.tokenId}` : ""}
        </Text>
      </VStack>
      <Box py={3}>
        <ImageWithFallback
          w="300px"
          src={
            nft.image ? getNftImageLink(nft.id, 600) : collectionInfo?.avatar
          }
        />
      </Box>
      <HStack w="full" justifyContent="center">
        <SwitchNetworkButton symbol={chainInfo?.symbol} name={chainInfo?.name}>
          <PrimaryButton
            w="full"
            isLoading={loading}
            onClick={cancelSale}
          >
            Confirm
          </PrimaryButton>
        </SwitchNetworkButton>
      </HStack>
    </VStack>
  );
};
