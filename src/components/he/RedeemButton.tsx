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
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import configs from "../../configs";
import heCustomizeContract from "../../contracts/heCustomizeContract";
import {
  useGetChainInfo,
  useGetCollectionInfo,
} from "../../hooks/useGetSystemInfo";
import useSwal from "../../hooks/useSwal";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { selectProfile } from "../../store/profileSlice";
import { getNftImageLink } from "../../utils/utils";
import { ImageWithFallback } from "../LazyImage";
import PrimaryButton from "../PrimaryButton";
import SwitchNetworkButtonWrapper from "../SwitchNetworkButton";

export default function RedeemButton({
  nft,
  onSuccess,
  children,
  ...rest
}: { nft: NftDto; onSuccess?: () => void } & BoxProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { chainInfo } = useGetChainInfo({ chainId: nft.chain });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: nft.nftCollection,
  });
  const redeemAvailableContracts = [
    ...configs.HE_GEAR_CONTRACTS,
    ...configs.HE_HERO_CONTRACTS,
    ...configs.HE_HERO_CHEST_CONTRACTS,
    ...configs.HE_SKIN_CHEST_CONTRACTS,
  ];
  const { user } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const enable = useMemo(
    () => redeemAvailableContracts.includes(nft?.nftContract.toLowerCase()),
    [nft?.nftContract, redeemAvailableContracts]
  );
  const { swAlert } = useSwal();
  const redeemNftHandle = async () => {
    try {
      setLoading(true);
      const nftContract = nft?.nftContract.toLowerCase();
      if (configs.HE_HERO_CONTRACTS.includes(nftContract)) {
        await heCustomizeContract
          .redeemHeros(chainInfo.redeemGearContract, [nft.tokenId])
          .send({ from: user });
      } else if (configs.HE_GEAR_CONTRACTS.includes(nftContract)) {
        await heCustomizeContract
          .redeemGears(chainInfo.redeemHeroContract, [nft.tokenId])
          .send({ from: user });
      } else if (configs.HE_HERO_CHEST_CONTRACTS.includes(nftContract)) {
        await heCustomizeContract
          .redeemHeroChest(nft.nftContract, nft.tokenId)
          .send({ from: user });
      } else if (configs.HE_SKIN_CHEST_CONTRACTS.includes(nftContract)) {
        await heCustomizeContract
          .redeemSkinChest(nft.nftContract, nft.tokenId)
          .send({ from: user });
      }
      onClose();
      onSuccess && onSuccess();
      swAlert({
        title: "COMPLETE",
        text: `Redeem successfully!`,
        icon: "success",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Inventory",
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
    enable && (
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
                <Heading fontSize="2xl">REDEEM NFT</Heading>
                <HStack justifyContent="center" spacing={0}>
                  <Text w="full" textAlign="center">
                    You are about redeem{" "}
                    <b>
                      {nft.name} {nft.tokenId ? `#${nft.tokenId}` : ""}
                    </b>
                  </Text>
                </HStack>
                <Box py={3}>
                  <ImageWithFallback
                    w="300px"
                    src={
                      nft.image
                        ? getNftImageLink(nft.id, 600)
                        : collectionInfo?.avatar
                    }
                  />
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter w="full">
              <HStack w="full" justifyContent="center" px={5}>
                <SwitchNetworkButtonWrapper
                  symbol={chainInfo?.symbol}
                  name={chainInfo?.name}
                >
                  <PrimaryButton
                    disabled={loading}
                    isLoading={loading}
                    onClick={redeemNftHandle}
                    w="full"
                  >
                    Confirm
                  </PrimaryButton>
                </SwitchNetworkButtonWrapper>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  );
}
