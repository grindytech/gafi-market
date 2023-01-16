import {
  Box,
  HStack,
  Icon,
  Link,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import NextLink from "next/link";
import { HiBadgeCheck } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import Icons from "../../images";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { NftHistoryDto } from "../../services/types/dtos/NftHistory.dto";
import { selectProfile } from "../../store/profileSlice";
import { getUserName, numeralFormat } from "../../utils/utils";
import Skeleton from "../Skeleton";
import NftCard from "./NftCard";

export default function NftCardRecentlySold({
  history,
  loading,
}: {
  history?: NftHistoryDto;
  loading?: boolean;
}) {
  const { user } = useSelector(selectProfile);
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: true,
    paymentSymbol: history.paymentToken.symbol,
  });
  return (
    <NftCard loading={loading} image={history?.image}>
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
            <HStack alignItems="start" w="full" justifyContent="space-between">
              <VStack spacing={0} alignItems="start">
                <Text noOfLines={1} fontSize="md" fontWeight="semibold">
                  {history?.name || <>&nbsp;</>}
                </Text>
                <Text color="gray" fontSize="xs" fontWeight="semibold">
                  #{history?.tokenId}
                </Text>
              </VStack>
              <VStack spacing={0} alignItems="end">
                <Tooltip label={history?.chain?.name}>
                  <Icon blur="xl" w={5} h={5}>
                    {Icons.chain[String(history?.chain?.symbol).toUpperCase()]
                      ? Icons.chain[
                          String(history?.chain?.symbol).toUpperCase()
                        ]()
                      : ""}
                  </Icon>
                </Tooltip>
                <Text
                  fontWeight="semibold"
                  noOfLines={1}
                  fontSize="xs"
                  color="gray.500"
                  textAlign="left"
                  title={`${new Date(history?.createdAt || 0).toUTCString()}`}
                >
                  {formatDistance(
                    new Date(history?.createdAt || 0),
                    Date.now(),
                    {
                      includeSeconds: false,
                      addSuffix: true,
                    }
                  )}
                </Text>
              </VStack>
            </HStack>
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
                    ? `${history.price} ${history?.paymentToken.symbol}`
                    : ""
                )}
              >
                {history?.price > 0 &&
                  `${numeralFormat(history?.price)} ${
                    history.paymentToken.symbol
                  }`}
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
