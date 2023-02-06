import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { get } from "lodash";
import NextLink from "next/link";
import { useMemo } from "react";
import { BiGift } from "react-icons/bi";
import { BsBox, BsThreeDots } from "react-icons/bs";
import { HiBadgeCheck } from "react-icons/hi";
import { useSelector } from "react-redux";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import Icons from "../../images";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { selectBag } from "../../store/bagSlice";
import { selectProfile } from "../../store/profileSlice";
import { numeralFormat } from "../../utils/utils";
import FloatIconWithText from "../FloatIconWithText";
import RefreshMetadataButton from "../nft/RefreshMetadataButton";
import Skeleton from "../Skeleton";
import { AddToCartButton } from "./AddToCartButton";
import BuyButton from "./BuyButton";
import CancelBtn from "./CancelButton";
import { MASKS } from "./mask";
import NftCard from "./NftCard";
import OfferButton from "./OfferButton";
import SaleButton from "./SaleButton";
export default function NftCardMarket({
  nft,
  loading,
  onCancelSale,
  onSale,
  onBuy,
  selected,
  menuItems,
  showMenu = true,
  disabled,
}: {
  nft?: NftDto;
  loading?: boolean;
  onCancelSale?: (nft: NftDto) => void;
  onSale?: (nft: NftDto) => void;
  onBuy?: (nft: NftDto) => void;
  selected?: boolean;
  menuItems?: any;
  showMenu?: boolean;
  disabled?: boolean;
}) {
  const { chainInfo } = useGetChainInfo({ chainId: nft?.chain });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: nft?.nftCollection,
  });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: nft?.sale?.paymentToken,
  });
  const { user } = useSelector(selectProfile);
  const isOwner = user === nft?.owner.address;
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: !!nft?.sale,
    paymentSymbol: paymentInfo?.symbol,
  });
  const { items } = useSelector(selectBag);
  const isInCart = useMemo(
    () => !!items.find((i) => i.id === nft?.id && nft.sale?.id === i.sale.id),
    [items, nft]
  );

  const mask = get(MASKS, collectionInfo?.key);
  return (
    <NftCard
      disabled={disabled}
      className={isInCart || selected ? "selected" : ""}
      loading={loading}
      image={nft?.image}
      showOnHover={
        nft &&
        showMenu && (
          <VStack
            onClick={(e) => {
              e.preventDefault();
            }}
            textAlign="left"
            position="absolute"
            right={0}
            top={0}
            p={3}
          >
            <Menu>
              <MenuButton
                aria-label="Menu"
                as={IconButton}
                icon={<BsThreeDots />}
                size="sm"
                variant="ghost"
              />
              {/* <IconButton variant="ghost" /> */}
              <MenuList fontSize="sm">
                <VStack spacing={0} w="full" alignItems="start">
                  <MenuItem>
                    <RefreshMetadataButton nftId={nft.id}>
                      Refetch metadata
                    </RefreshMetadataButton>
                  </MenuItem>
                  {!nft?.sale ? (
                    <>
                      {!isOwner && (
                        <MenuItem>
                          <OfferButton w="full" nft={nft}>
                            Make offer
                          </OfferButton>
                        </MenuItem>
                      )}
                      {isOwner && (
                        <MenuItem>
                          <SaleButton
                            w="full"
                            onSuccess={() => {
                              onSale && onSale(nft);
                            }}
                            nft={nft}
                          >
                            Put on sale
                          </SaleButton>
                        </MenuItem>
                      )}
                    </>
                  ) : isOwner ? (
                    <MenuItem>
                      <CancelBtn
                        color="red.400"
                        w="full"
                        onSuccess={() => {
                          onCancelSale && onCancelSale(nft);
                        }}
                        nft={nft}
                      >
                        Cancel sale
                      </CancelBtn>
                    </MenuItem>
                  ) : (
                    <>
                      <MenuItem>
                        <BuyButton
                          w="full"
                          nft={nft}
                          onSuccess={() => {
                            onBuy && onBuy(nft);
                          }}
                          rounded="none"
                        >
                          Buy now
                        </BuyButton>
                      </MenuItem>
                      <MenuItem>
                        <AddToCartButton w="full" nft={nft} />
                      </MenuItem>
                    </>
                  )}
                  {menuItems && menuItems}
                </VStack>
              </MenuList>
            </Menu>
          </VStack>
        )
      }
      mask={mask ? mask({ nft: nft }) : <></>}
      bundle={nft?.bundle}
    >
      <VStack w="full" alignItems="start" p={2} spacing={2}>
        <VStack p={1} w="full" alignItems="start" spacing={1}>
          <Skeleton minW={100} height="1em" isLoaded={!loading}>
            <NextLink href={`/collection/${collectionInfo?.key}`}>
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
                    {collectionInfo?.name}
                  </Text>
                </Box>
                {collectionInfo?.verified && (
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
                <Text
                  noOfLines={1}
                  color="gray"
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  #{nft?.tokenId}
                </Text>
              </VStack>
              <Tooltip label={chainInfo?.name}>
                <Icon blur="xl" w={5} h={5}>
                  {Icons.chain[String(chainInfo?.symbol).toUpperCase()]
                    ? Icons.chain[String(chainInfo?.symbol).toUpperCase()]()
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
                    nft?.price > 0 ? `${nft.price} ${paymentInfo?.symbol}` : ""
                  )}
                >
                  {nft?.price > 0
                    ? `${numeralFormat(nft?.price)} ${paymentInfo?.symbol}`
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
