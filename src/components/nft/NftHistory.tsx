import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Icon,
  Link,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import NextLink from "next/link";
import { useMemo, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import {
  useGetChainInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import nftService from "../../services/nft.service";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { NftHistoryDto } from "../../services/types/dtos/NftHistory.dto";
import { HistoryType } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import { getUserName, numeralFormat } from "../../utils/utils";
import { EmptyState, ErrorState } from "../EmptyState";
import Skeleton from "../Skeleton";

export default function NftHistory({ nft }: { nft: NftDto }) {
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
    ["NftHistory", nft?.id],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getHistories({
        nft: nft.id,
        page: pageParam,
        orderBy: "blockTime",
        desc: "desc",
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
      {!isLoading &&
        histories.map((h) => (
          <Box p={2} w="full" _hover={{ boxShadow: "md" }}>
            <HistoryListItem history={h} />
          </Box>
        ))}
      {(isLoading || isFetching) &&
        histories.length === 0 &&
        Array.from(Array(4).keys()).map((k) => (
          <HistoryListItem loading key={`HistoryListItem-template-${k}`} />
        ))}
      {!isLoading && !isFetching && hasNextPage && <div ref={loadingRef} />}
      <Box my={3}>
        {hasNextPage &&
          (isFetchingNextPage ? (
            <HStack py={3} w="full" justifyContent="center">
              <Spinner thickness="4px" speed="0.65s" size="lg" />
            </HStack>
          ) : (
            <></>
          ))}
      </Box>
    </VStack>
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
                color="gray"
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
  );
}
