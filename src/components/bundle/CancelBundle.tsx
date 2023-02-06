import {
  Box,
  BoxProps,
  Heading,
  HStack,
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
import bundleContract from "../../contracts/bundle.contract";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import useSwal from "../../hooks/useSwal";
import { BundleDto } from "../../services/types/dtos/BundleDto";
import { selectProfile } from "../../store/profileSlice";
import { convertToContractValue } from "../../utils/utils";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButton from "../SwitchNetworkButton";

export default function CancelBundle({
  bundle,
  children,
  onSuccess,
  ...rest
}: BoxProps & { bundle: BundleDto; onSuccess: () => void }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(selectProfile);
  const { swAlert } = useSwal();
  const { chainInfo } = useGetChainInfo({ chainId: bundle.chain });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: bundle.paymentToken,
  });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: bundle.nftCollection,
  });
  const cancel = async () => {
    try {
      setLoading(true);
      const tokenIds = bundle?.items.map((item) => Number(item.tokenId)).sort();
      const price = convertToContractValue({
        amount: bundle.price,
        decimal: paymentInfo.decimals,
      });
      await bundleContract.cancelBundle(chainInfo.bundleContract, user, {
        bundleId: bundle.bundleId,
        nftContract: collectionInfo.nftContract,
        paymentTokenAddress: paymentInfo.contractAddress,
        price,
        saltNonce: String(bundle.saltNonce),
        seller: user,
        signedSignature: bundle.signedSignature,
        tokenIds,
      });
      onClose();
      onSuccess && onSuccess();
      swAlert({
        title: "Complete",
        text: "Cancel successfully.",
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
            <VStack pt={5} px={5} w="full">
              <Heading fontSize="2xl">CANCEL BUNDLE SALE</Heading>
              <VStack spacing={0}>
                <Text>You are about cancel sell your&nbsp;</Text>
                <Text color="gray">
                  {bundle.name || `Bundle #${bundle.bundleId}`}
                </Text>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter w="full">
            <HStack w="full" justifyContent="center" px={5}>
              <SwitchNetworkButton
                symbol={chainInfo?.symbol}
                name={chainInfo?.name}
              >
                <PrimaryButton w="full" isLoading={loading} onClick={cancel}>
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
