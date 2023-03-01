import {
  Box,
  Button,
  Fade,
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
import { BsThreeDots } from "react-icons/bs";
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
import {
  getNftAnimationLink,
  getNftImageLink,
  numeralFormat,
} from "../../utils/utils";
import RefreshMetadataButton from "../nft/RefreshMetadataButton";
import PrimaryButton from "../PrimaryButton";
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

  const mask = MASKS(collectionInfo?.nftContract.toLowerCase());
  const isVideo = nft?.animationPlayType?.includes("video");

  return (
    <Box position="relative">
      <NftCard
        disabled={disabled}
        className={isInCart || selected ? "selected" : ""}
        loading={loading}
        image={
          nft?.image ? getNftImageLink(nft.id, 600) : collectionInfo?.avatar
        }
        videoUri={isVideo ? getNftAnimationLink(nft?.id) : undefined}
        bgImage={
          !nft?.image
            ? collectionInfo?.featuredImage || collectionInfo?.cover
            : undefined
        }
        mask={mask ? mask({ nft: nft }) : <></>}
        bundle={nft?.bundle}
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
                        <PrimaryButton size="sm" as={OfferButton} nft={nft}>
                          Make offer
                        </PrimaryButton>
                      </HStack>
                    )}
                    {isOwner && (
                      <PrimaryButton
                        onSuccess={() => {
                          onSale && onSale(nft);
                        }}
                        nft={nft}
                        as={SaleButton}
                        size="sm"
                      >
                        Put on sale
                      </PrimaryButton>
                    )}
                  </>
                ) : isOwner ? (
                  <HStack>
                    <PrimaryButton
                      as={CancelBtn}
                      colorScheme="red"
                      onSuccess={() => {
                        onCancelSale && onCancelSale(nft);
                      }}
                      nft={nft}
                      size="sm"
                      bg="red.500"
                    >
                      Cancel
                    </PrimaryButton>
                  </HStack>
                ) : (
                  <HStack>
                    <PrimaryButton
                      as={BuyButton}
                      nft={nft}
                      onSuccess={() => {
                        onBuy && onBuy(nft);
                      }}
                      size="sm"
                    >
                      Buy now
                    </PrimaryButton>
                    <Button
                      as={AddToCartButton}
                      showText={false}
                      showIcon={true}
                      nft={nft}
                      size="sm"
                    />
                  </HStack>
                )}
              </Fade>
            </HStack>
          </VStack>
        }
      >
        <VStack w="full" alignItems="start" p={2} spacing={2}>
          <VStack p={1} w="full" alignItems="start" spacing={1}>
            <Skeleton w="full" minW={100} height="1em" isLoaded={!loading}>
              <NextLink href={`/collection/${collectionInfo?.key}`}>
                <HStack
                  w="full"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <HStack spacing={0} alignItems="center">
                    <Box>
                      <Text
                        noOfLines={1}
                        _hover={{
                          textDecoration: "underline",
                        }}
                        color="primary.50"
                        fontSize="xs"
                        fontWeight="semibold"
                        textOverflow="ellipsis"
                      >
                        {collectionInfo?.name}&nbsp;
                      </Text>
                    </Box>
                    {collectionInfo?.verified && (
                      <Icon color="primary.50" h={4} w={4}>
                        <HiBadgeCheck size="20px" />
                      </Icon>
                    )}
                  </HStack>
                  <Tooltip label={chainInfo?.name}>
                    <Icon blur="xl" w={4} h={4}>
                      {Icons.chain[String(chainInfo?.symbol).toUpperCase()]
                        ? Icons.chain[String(chainInfo?.symbol).toUpperCase()]()
                        : ""}
                    </Icon>
                  </Tooltip>
                </HStack>
              </NextLink>
            </Skeleton>
            <Skeleton w="full" isLoaded={!loading}>
              <HStack
                alignItems="start"
                w="full"
                justifyContent="space-between"
              >
                <VStack spacing={0} alignItems="start">
                  <Text noOfLines={1} fontSize="md" fontWeight="semibold">
                    {nft?.name || collectionInfo?.name || <>&nbsp;</>}
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
            {nft && showMenu && (
              <Box onClick={(e) => e.preventDefault()}>
                <Menu>
                  <MenuButton
                    color="gray.500"
                    aria-label="Menu"
                    as={IconButton}
                    icon={<BsThreeDots />}
                    size="sm"
                    variant="ghost"
                    px={0}
                    display="flex"
                  />
                  <MenuList zIndex={10} fontSize="sm">
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
              </Box>
            )}
          </HStack>
        </VStack>
      </NftCard>
    </Box>
  );
}
