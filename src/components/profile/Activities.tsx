import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Image,
  Link,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import NextLink from "next/link";
import React, { useMemo, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { Images } from "../../images";
import nftService from "../../services/nft.service";
import { NftHistoryDto } from "../../services/types/dtos/NftHistory.dto";
import { HistoryType } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import { getUserName, numeralFormat } from "../../utils/utils";
import EmptyState, { ErrorState } from "../EmptyState";
import Skeleton from "../Skeleton";

export default function UserActivities({
  address,
  collection,
}: {
  address?: string;
  collection?: string;
}) {
  const {
    data,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["NftHistory", address, collection],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getHistories({
        page: pageParam,
        orderBy: "blockTime",
        desc: "desc",
        userAddress: address,
        nftCollection: collection,
        type: [
          HistoryType.Burn,
          HistoryType.Sale,
          HistoryType.Mint,
          HistoryType.Transfer,
        ],
      });
      return rs.data;
    },
    {
      enabled: !!address || !!collection,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage.hasPrevious ? firstPage.currentPage - 1 : undefined,
      onSuccess: () => {},
      onError: (error) => {
        console.error(error);
      },
    }
  );
  const histories = useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data]
  );

  const loadingRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: loadingRef,
    onIntersect: fetchNextPage,
    enabled: !isLoading && !isFetching && hasNextPage,
  });
  const isEmpty = useMemo(
    () => !isError && !isLoading && !isFetching && histories.length === 0,
    [isError, isLoading, isFetching, histories.length]
  );
  const md = useBreakpointValue({ base: false, md: true });
  const LoadingItem = md ? (
    <Table>
      <HistoryItemDesktop loading />
    </Table>
  ) : (
    <HistoryListItem loading />
  );
  return (
    <VStack spacing={0} w="full">
      {isEmpty && (
        <Box w="full">
          <EmptyState msg="No histories found" />
        </Box>
      )}
      {isError && (
        <Box w="full" py={10}>
          <ErrorState>
            <Button
              onClick={() => {
                refetch();
              }}
            >
              Try again
            </Button>
          </ErrorState>
        </Box>
      )}

      {!isLoading && md && !isEmpty && !isError && (
        <TableContainer overflow="auto" w="full">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Item</Th>
                <Th>Price</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {histories.map((history, index) => (
                <HistoryItemDesktop key={history.id} history={history} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {!isLoading &&
        !md &&
        histories.map((h, index) => (
          <>
            {index !== 0 && <Divider />}
            <Box p={2} w="full" className="highlight-hover">
              <HistoryListItem history={h} />
            </Box>
          </>
        ))}
      {!isLoading && !isFetching && hasNextPage && <div ref={loadingRef} />}
      {(hasNextPage && isFetchingNextPage) ||
      ((isLoading || isFetching) && histories.length === 0) ? (
        Array.from(Array(4).keys()).map((k, index) => (
          <>
            {index !== 0 && <Divider />}
            {React.cloneElement(LoadingItem)}
          </>
        ))
      ) : (
        <></>
      )}
    </VStack>
  );
}

function HistoryItemDesktop({
  history,
  loading,
}: {
  loading?: boolean;
  history?: NftHistoryDto;
}) {
  const { user } = useSelector(selectProfile);
  const { chainInfo } = useGetChainInfo({ chainId: history?.chain });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: history?.nftCollection,
  });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: history?.paymentToken,
  });
  return (
    <Tr className="highlight-hover">
      <Td>
        <Skeleton isLoaded={!loading}>
          <HStack w="full">
            <Image
              src={history?.image}
              rounded="md"
              fallbackSrc={Images.Placeholder.src}
              w={14}
              h={14}
            />
            <VStack spacing={0} alignItems="start">
              {history?.nftCollection ? (
                <Link
                  as={NextLink}
                  href={`/collection/${history?.nftContract}`}
                >
                  <Text
                    noOfLines={1}
                    color="primary.50"
                    fontWeight="semibold"
                    fontSize="xs"
                  >
                    {history?.nftCollection.name}{" "}
                    {history?.nftCollection.verified && (
                      <Icon color="primary.50" h={3} w={3}>
                        <HiBadgeCheck size="25px" />
                      </Icon>
                    )}
                  </Text>
                </Link>
              ) : (
                <Box />
              )}
              <Link
                as={NextLink}
                href={`/nft/${history?.nftContract}:${history?.tokenId}`}
              >
                <Text noOfLines={1}>{history?.name}</Text>
              </Link>
              <Link
                as={NextLink}
                href={`/nft/${history?.nftContract}:${history?.tokenId}`}
              >
                <Text noOfLines={1} fontSize="xs" color="gray.400">
                  #{history?.tokenId}
                </Text>
              </Link>
            </VStack>
          </HStack>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <VStack spacing={0} alignItems="start">
            {history?.price && (
              <Text noOfLines={1} fontSize="sm" color="gray">
                {`${numeralFormat(history?.price)} ${paymentInfo?.symbol}`}{" "}
              </Text>
            )}
            {history?.priceInUsd && (
              <Text noOfLines={1} fontSize="xs" color="gray.500">
                &nbsp;${numeralFormat(history?.priceInUsd)}
              </Text>
            )}
            {history?.bundle && (
              <Button
                color="gray.500"
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(`/bundle/${history.bundle.id}`, "_blank");
                }}
                size="xs"
                rounded="xl"
              >
                <HStack spacing={1} alignItems="center">
                  <Text fontSize="xs">Bundle sale</Text>
                  <ExternalLinkIcon w={3} h={3} />
                </HStack>
              </Button>
            )}
          </VStack>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <Button
            variant="link"
            as={NextLink}
            w="full"
            href={`/profile/${history?.from?.address}`}
          >
            <Text w="full" textAlign="left" noOfLines={1}>
              {getUserName(history?.from, user)}
            </Text>
          </Button>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <Button
            as={NextLink}
            variant="link"
            w="full"
            href={`/profile/${history?.to?.address}`}
          >
            <Text w="full" textAlign="left" noOfLines={1}>
              {getUserName(history?.to, user)}
            </Text>
          </Button>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <HStack justifyContent="start" color="gray">
            <Tooltip
              label={new Date((history?.blockTime || 0) * 1e3).toUTCString()}
            >
              <Text textAlign="left" fontSize="sm">
                {formatDistance(
                  new Date((history?.blockTime || 0) * 1e3),
                  Date.now(),
                  {
                    includeSeconds: false,
                    addSuffix: true,
                  }
                )}
              </Text>
            </Tooltip>
            <Link
              target="_blank"
              fontSize="sm"
              href={`${chainInfo?.explore}/tx/${history?.txHash}`}
            >
              <ExternalLinkIcon />
            </Link>
          </HStack>
        </Skeleton>
      </Td>
    </Tr>
  );
}

function HistoryListItem({
  history,
  loading,
}: {
  loading?: boolean;
  history?: NftHistoryDto;
}) {
  const { user } = useSelector(selectProfile);
  const { chainInfo } = useGetChainInfo({ chainId: history?.chain });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: history?.paymentToken,
  });
  return (
    <Stack
      w="full"
      alignItems="end"
      spacing={3}
      direction={{ base: "column", sm: "row" }}
    >
      <HStack w="full">
        <Image
          src={history?.nft?.image}
          rounded="md"
          fallbackSrc={Images.Placeholder.src}
          w={14}
          h={14}
        />
        <VStack spacing={0} alignItems="start">
          {history?.nftCollection ? (
            <Link as={NextLink} href={`/collection/${history?.nftContract}`}>
              <Text
                noOfLines={1}
                color="primary.50"
                fontWeight="semibold"
                fontSize="xs"
              >
                {history?.nftCollection.name}{" "}
                {history?.nftCollection.verified && (
                  <Icon color="primary.50" h={4} w={4}>
                    <HiBadgeCheck size="25px" />
                  </Icon>
                )}
              </Text>
            </Link>
          ) : (
            <Box />
          )}
          <Link
            as={NextLink}
            href={`/nft/${history?.nftContract}:${history?.tokenId}`}
          >
            <Text noOfLines={1}>{history?.nft?.name}</Text>
          </Link>
          <Link as={NextLink} href={`/nft/${history?.nft?.id}`}>
            <Text noOfLines={1} fontSize="xs" color="gray.400">
              #{history?.nft?.tokenId}
            </Text>
          </Link>
        </VStack>
      </HStack>
      <VStack w="full" spacing={0}>
        <Skeleton w="full" isLoaded={!loading}>
          <HStack w="full" alignItems="start" justifyContent="space-between">
            <Button
              variant="link"
              as={NextLink}
              textAlign="left"
              w="full"
              href={`/profile/${history?.from?.address}`}
            >
              <Text w="full" textAlign="left" noOfLines={1}>
                {getUserName(history?.from, user)}
              </Text>
            </Button>
            <Icon color="gray" w={6} h={6} fontSize="lg">
              <FiArrowRight />
            </Icon>
            <Button
              as={NextLink}
              variant="link"
              textAlign="right"
              w="full"
              href={`/profile/${history?.to?.address}`}
            >
              <Text w="full" textAlign="right" noOfLines={1}>
                {getUserName(history?.to, user)}
              </Text>
            </Button>
          </HStack>
        </Skeleton>
        <HStack w="full">
          <Skeleton w="full" isLoaded={!loading}>
            <HStack alignItems="end">
              {history?.price && (
                <Text noOfLines={1} fontSize="sm" color="gray">
                  {`${numeralFormat(history?.price)} ${paymentInfo?.symbol}`}{" "}
                </Text>
              )}
              {history?.priceInUsd && (
                <Text noOfLines={1} fontSize="xs" color="gray.500">
                  &nbsp;${numeralFormat(history?.priceInUsd)}
                </Text>
              )}
              {history?.bundle && (
                <Button
                  color="gray.500"
                  variant="link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`/bundle/${history.bundle.id}`, "_blank");
                  }}
                  size="xs"
                  rounded="xl"
                >
                  <HStack spacing={1} alignItems="center">
                    <Text fontSize="xs">Bundle sale</Text>
                    <ExternalLinkIcon w={3} h={3} />
                  </HStack>
                </Button>
              )}
            </HStack>
          </Skeleton>
          <Skeleton w="full" isLoaded={!loading}>
            <HStack justifyContent="end" color="gray">
              <Tooltip
                label={new Date((history?.blockTime || 0) * 1e3).toUTCString()}
              >
                <Text fontSize="sm">
                  {formatDistance(
                    new Date((history?.blockTime || 0) * 1e3),
                    Date.now(),
                    {
                      includeSeconds: false,
                      addSuffix: true,
                    }
                  )}
                </Text>
              </Tooltip>
              <Link
                target="_blank"
                fontSize="sm"
                href={`${chainInfo?.explore}/tx/${history?.txHash}`}
              >
                <ExternalLinkIcon />
              </Link>
            </HStack>
          </Skeleton>
        </HStack>
      </VStack>
    </Stack>
  );
}
