import {
  Box,
  Button,
  HStack,
  Icon,
  Link,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { get } from "lodash";
import NextLink from "next/link";
import { BsBox } from "react-icons/bs";
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
import { NftHistoryDto } from "../../services/types/dtos/NftHistory.dto";
import { selectProfile } from "../../store/profileSlice";
import { getUserName, numeralFormat } from "../../utils/utils";
import FloatIconWithText from "../FloatIconWithText";
import Skeleton from "../Skeleton";
import { MASKS } from "./mask";
import NftCard from "./NftCard";

export default function NftCardRecentlySold({
  history,
  loading,
}: {
  history?: NftHistoryDto;
  loading?: boolean;
}) {
  const { user } = useSelector(selectProfile);
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: history?.paymentToken,
  });
  const { chainInfo } = useGetChainInfo({ chainId: history?.chain });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: history?.nftCollection,
  });
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: true,
    paymentSymbol: paymentInfo?.symbol,
  });
  const mask = get(MASKS, collectionInfo?.key);

  return (
    <NftCard
      mask={mask ? mask({ nft: history?.nft }) : <></>}
      loading={loading}
      image={history?.image}
      // bundle={history?.nft?.bundle}
    >
      <VStack w="full" alignItems="start" p={2} spacing={2}>
        <VStack p={1} w="full" alignItems="start" spacing={1}>
          <Skeleton minW={100} height="1em" isLoaded={!loading}>
            <NextLink href={`/collection/${history.nftCollection.key}`}>
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
                    {history?.nftCollection.name}
                  </Text>
                </Box>
                {history?.nftCollection.verified && (
                  <Icon color="primary.50" h={4} w={4}>
                    <HiBadgeCheck size="25px" />
                  </Icon>
                )}
              </HStack>
            </NextLink>
          </Skeleton>
          <Skeleton w="full" isLoaded={!loading}>
            <VStack
              spacing={0}
              alignItems="start"
              w="full"
              justifyContent="space-between"
            >
              <HStack w="full" justifyContent="space-between">
                <Text noOfLines={1} fontSize="md" fontWeight="semibold">
                  {history?.name || <>&nbsp;</>}
                </Text>
                <Tooltip label={chainInfo?.name}>
                  <Icon blur="xl" w={5} h={5}>
                    {Icons.chain[String(chainInfo?.symbol).toUpperCase()]
                      ? Icons.chain[String(chainInfo?.symbol).toUpperCase()]()
                      : ""}
                  </Icon>
                </Tooltip>
              </HStack>
              <HStack w="full" justifyContent="space-between">
                <Text color="gray" fontSize="xs" fontWeight="semibold">
                  #{history?.tokenId}
                </Text>
                <Text
                  fontWeight="semibold"
                  noOfLines={1}
                  fontSize="xs"
                  color="gray.500"
                  textAlign="left"
                  title={`${new Date(
                    (history?.blockTime || 0) * 1e3
                  ).toUTCString()}`}
                >
                  {formatDistance(
                    new Date((history?.blockTime || 0) * 1e3),
                    Date.now(),
                    {
                      includeSeconds: false,
                      addSuffix: true,
                    }
                  )}
                </Text>
              </HStack>
            </VStack>
          </Skeleton>
          <HStack w="full" alignItems="center">
            <Skeleton isLoaded={!loading}>
              <Text
                fontWeight="semibold"
                noOfLines={1}
                fontSize="sm"
                color="gray"
                title={String(
                  history?.price > 0
                    ? `${history.price} ${paymentInfo?.symbol}`
                    : ""
                )}
              >
                {history?.price > 0 &&
                  `${numeralFormat(history?.price)} ${paymentInfo?.symbol}`}
              </Text>
            </Skeleton>
            {history?.priceInUsd && priceAsUsd && (
              <Text
                fontWeight="semibold"
                noOfLines={1}
                fontSize="xs"
                color="gray.500"
                textAlign="left"
                title={`${prefix}${history.priceInUsd}`}
              >
                ~{prefix}
                {numeralFormat(history.priceInUsd, 4)}
              </Text>
            )}
          </HStack>
        </VStack>

        <VStack
          p={3}
          bg="rgba(100,100,100,0.1)"
          w="full"
          justifyContent="space-between"
          rounded="xl"
        >
          <HStack w="full" justifyContent="space-between">
            <VStack w="50%" spacing={0} alignItems="start">
              <Text fontSize="sm" fontWeight="semibold">
                From
              </Text>
              <Link
                as={NextLink}
                _hover={{
                  textDecoration: "underline",
                }}
                fontWeight="semibold"
                noOfLines={1}
                fontSize="sm"
                color="gray"
                title={String(history.from.address)}
                href={`/profile/${history.from.address}`}
              >
                {getUserName(history.from, user)}
              </Link>
            </VStack>
            <VStack w="50%" spacing={0} alignItems="start">
              <Text fontSize="sm" fontWeight="semibold">
                To
              </Text>
              <Link
                as={NextLink}
                _hover={{
                  textDecoration: "underline",
                }}
                href={`/profile/${history.to.address}`}
                fontWeight="semibold"
                noOfLines={1}
                fontSize="sm"
                color="gray"
                title={String(history.to.address)}
              >
                {getUserName(history.to, user)}
              </Link>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </NftCard>
  );
}
