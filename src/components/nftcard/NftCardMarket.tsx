import {
  Box,
  Fade,
  HStack,
  Icon,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { get } from "lodash";
import NextLink from "next/link";
import { useMemo } from "react";
import { HiBadgeCheck } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import Icons from "../../images";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { selectBag } from "../../store/bagSlice";
import { selectProfile } from "../../store/profileSlice";
import { numeralFormat } from "../../utils/utils";
import Skeleton from "../Skeleton";
import { AddToCartButton } from "./AddToCartButton";
import BuyButton from "./BuyButton";
import CancelBtn from "./CancelButton";
import { MASKS } from "./mask";
import NftCard from "./NftCard";
import SaleButton from "./SaleButton";
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
  const md = useBreakpointValue({ base: false, md: true });

  const mask = get(MASKS, nft?.nftCollection.key);
  return (
    <NftCard
      className={isInCart ? "in-cart" : ""}
      loading={loading}
      image={nft?.image}
      showOnHover={
        md ? (
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
                        {/* <PrimaryButton as={OfferButton} nft={nft}>
                          Make offer
                        </PrimaryButton> */}
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
        ) : undefined
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
