import {
  Box,
  Button,
  Fade,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profileSlice";
import PrimaryButton from "../PrimaryButton";
import NftCard from "./NftCard";
import NextLink from "next/link";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import Skeleton from "../Skeleton";
import Icons from "../../images";
import SaleButton from "./SaleButton";
import CancelBtn from "./CancelButton";
import BuyButton from "./BuyButton";
import OfferButton from "./OfferButton";

export default function NftCardMarket({
  nft,
  loading,
  onCancelSale,
  onSale,
  onBuy,
}: {
  nft?: NftDto;
  loading?: boolean;
  onCancelSale?: (nft: NftDto) => void;
  onSale?: (nft: NftDto) => void;
  onBuy?: (nft: NftDto) => void;
}) {
  const { user } = useSelector(selectProfile);
  const isOwner = user === nft?.owner.address;
  return (
    <NftCard
      loading={loading}
      image={nft?.image}
      showOnHover={
        <VStack
          w="full"
          h="full"
          justifyContent="space-between"
          alignItems="start"
          zIndex={3}
        >
          <Box></Box>
          <HStack w="full" justifyContent="center" p={2}>
            <Fade in={true}>
              {!nft?.sale ? (
                <>
                  {!isOwner && (
                    <HStack>
                      <OfferButton nft={nft}>Make offer</OfferButton>
                    </HStack>
                  )}
                  {isOwner && (
                    <SaleButton
                      onSuccess={() => {
                        onSale && onSale(nft);
                      }}
                      nft={nft}
                    >
                      Put on sale
                    </SaleButton>
                  )}
                </>
              ) : isOwner ? (
                <HStack>
                  <CancelBtn
                    onSuccess={() => {
                      onCancelSale && onCancelSale(nft);
                    }}
                    nft={nft}
                  >
                    Cancel
                  </CancelBtn>
                </HStack>
              ) : (
                <HStack>
                  <BuyButton
                    nft={nft}
                    onSuccess={() => {
                      onBuy && onBuy(nft);
                    }}
                  >
                    Buy now
                  </BuyButton>
                  <IconButton aria-label="Add to cart">
                    <FiPlus size="30px" />
                  </IconButton>
                </HStack>
              )}
            </Fade>
          </HStack>
        </VStack>
      }
    >
      <VStack w="full" alignItems="start" p={2} spacing={2}>
        <VStack p={1} w="full" alignItems="start" spacing={1}>
          <Skeleton minW={100} height="1em" isLoaded={!loading}>
            <NextLink href="#">
              <Text
                _hover={{
                  textDecoration: "underline",
                }}
                color="primary.50"
                fontSize="sm"
                fontWeight="semibold"
              >
                {nft?.nftCollection.name}{" "}
                {nft?.nftCollection.verified && (
                  <Icon color="primary.50" h={4} w={4}>
                    <HiBadgeCheck size="25px" />
                  </Icon>
                )}
              </Text>
            </NextLink>
          </Skeleton>
          <Skeleton w="full" isLoaded={!loading}>
            <HStack w="full" justifyContent="space-between">
              <VStack spacing={0} alignItems="start">
                <Text fontSize="md" fontWeight="semibold">
                  {nft?.name || <>&nbsp;</>}
                </Text>
                <Text color="gray" fontSize="xs" fontWeight="semibold">
                  #{nft?.tokenId}
                </Text>
              </VStack>
              <Icon blur="xl" w={5} h={5}>
                {Icons.chain[String(nft?.chain?.symbol).toUpperCase()]
                  ? Icons.chain[String(nft?.chain?.symbol).toUpperCase()]()
                  : ""}
              </Icon>
            </HStack>
          </Skeleton>
        </VStack>
        <HStack
          p={3}
          bg="rgba(100,100,100,0.1)"
          w="full"
          justifyContent="space-between"
          rounded="xl"
        >
          <VStack w="50%" alignItems="start" spacing={0}>
            <Text fontSize="sm" fontWeight="semibold">
              Price
            </Text>
            <Skeleton isLoaded={!loading}>
              <Text fontSize="sm" color="gray.400">
                {nft?.price > 0
                  ? `${nft?.price} ${nft?.sale.paymentToken.symbol}`
                  : "Not for sale"}
              </Text>
            </Skeleton>
          </VStack>
          <VStack w="50%" alignItems="start" spacing={0}>
            <Text fontSize="sm" fontWeight="semibold">
              Last sold
            </Text>
            <Skeleton isLoaded={!loading}>
              <Text fontSize="sm" color="gray.400" minW={50}>
                {nft?.lastSold >= 0
                  ? `${nft?.lastSold} ${nft?.lastSoldToken}`
                  : "--"}
              </Text>
            </Skeleton>
          </VStack>
        </HStack>
      </VStack>
    </NftCard>
  );
}
