import {
  Box,
  Button,
  Fade,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
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
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import { numeralFormat } from "../../utils/utils";
import { useMemo } from "react";
import { selectBag } from "../../store/bagSlice";
import { BsBagCheck, BsFillBagCheckFill } from "react-icons/bs";
import { AddToCartButton } from "./AddToCartButton";
import HeHeroMask, { HERO_KEY } from "./mask/HeHeroMask";
import { MASKS } from "./mask";
import { get } from "lodash";
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
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: !!nft?.sale,
    paymentSymbol: nft?.sale?.paymentToken.symbol,
  });
  const { items } = useSelector(selectBag);
  const isInCart = useMemo(
    () => !!items.find((i) => i.id === nft?.id && nft.sale?.id === i.sale.id),
    [items, nft]
  );
  const mask = get(MASKS, nft?.nftCollection.key);
  return (
    <NftCard
      className={isInCart ? "in-cart" : ""}
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
                      <PrimaryButton as={OfferButton} nft={nft}>
                        Make offer
                      </PrimaryButton>
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
                  <AddToCartButton nft={nft} />
                </HStack>
              )}
            </Fade>
          </HStack>
        </VStack>
      }
      mask={mask ? mask({ nft: nft }) : <></>}
    >
      <VStack w="full" alignItems="start" p={2} spacing={2}>
        <VStack p={1} w="full" alignItems="start" spacing={1}>
          <Skeleton minW={100} height="1em" isLoaded={!loading}>
            <NextLink href={`/collection/${nft?.nftCollection?.key}`}>
              <HStack spacing={0}>
                <Box>
                  <Text
                    noOfLines={1}
                    _hover={{
                      textDecoration: "underline",
                    }}
                    color="primary.50"
                    fontSize="sm"
                    fontWeight="semibold"
                    textOverflow="ellipsis"
                  >
                    {nft?.nftCollection?.name}
                  </Text>
                </Box>
                {nft?.nftCollection?.verified && (
                  <Icon color="primary.50" h={4} w={4}>
                    <HiBadgeCheck size="25px" />
                  </Icon>
                )}
              </HStack>
            </NextLink>
          </Skeleton>
          <Skeleton w="full" isLoaded={!loading}>
            <HStack alignItems="start" w="full" justifyContent="space-between">
              <VStack spacing={0} alignItems="start">
                <Text noOfLines={1} fontSize="md" fontWeight="semibold">
                  {nft?.name || <>&nbsp;</>}
                </Text>
                <Text color="gray" fontSize="xs" fontWeight="semibold">
                  #{nft?.tokenId}
                </Text>
              </VStack>
              <Tooltip label={nft?.chain?.name}>
                <Icon blur="xl" w={5} h={5}>
                  {Icons.chain[String(nft?.chain?.symbol).toUpperCase()]
                    ? Icons.chain[String(nft?.chain?.symbol).toUpperCase()]()
                    : ""}
                </Icon>
              </Tooltip>
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
          <VStack w="full" alignItems="start" spacing={0}>
            <Text fontSize="sm" fontWeight="semibold">
              Price
            </Text>
            <HStack w="full" alignItems="end">
              <Skeleton isLoaded={!loading}>
                <Text
                  fontWeight="semibold"
                  noOfLines={1}
                  fontSize="sm"
                  color="gray"
                  title={String(
                    nft?.price > 0
                      ? `${nft.price} ${nft?.sale.paymentToken.symbol}`
                      : ""
                  )}
                >
                  {nft?.price > 0
                    ? `${numeralFormat(nft?.price)} ${
                        nft?.sale.paymentToken.symbol
                      }`
                    : "Not for sale"}
                </Text>
              </Skeleton>
              {nft?.price && priceAsUsd && (
                <Text
                  fontWeight="semibold"
                  noOfLines={1}
                  fontSize="xs"
                  color="gray.500"
                  textAlign="left"
                  title={`${prefix}${nft.price * priceAsUsd}`}
                >
                  ~{prefix}
                  {numeralFormat(nft.price * priceAsUsd)}
                </Text>
              )}
            </HStack>
          </VStack>
          {/* <VStack w="50%" alignItems="start" spacing={0}>
            <Text fontSize="sm" fontWeight="semibold">
              Last sold
            </Text>
            <Skeleton isLoaded={!loading}>
              <Text noOfLines={1} fontSize="sm" color="gray.400" minW={50}>
                {nft?.lastSold >= 0
                  ? `${nft?.lastSold} ${nft?.lastSoldToken}`
                  : "--"}
              </Text>
            </Skeleton>
          </VStack> */}
        </HStack>
      </VStack>
    </NftCard>
  );
}
