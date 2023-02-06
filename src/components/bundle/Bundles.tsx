import {
  Box,
  Button,
  HStack,
  IconButton,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiFilter, FiRefreshCw } from "react-icons/fi";
import { useInfiniteQuery, useQuery } from "react-query";
import { useSelector } from "react-redux";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import nftService from "../../services/nft.service";
import { selectProfile } from "../../store/profileSlice";
import useCustomColors from "../../theme/useCustomColors";
import { EmptyState, ErrorState } from "../EmptyState";
import NftsFilter, {
  NftsFilterMobileBtn,
  BUNDLE_FILTER_OPTIONS,
} from "../filters/NftsFilter";
import Sort from "../filters/Sort";
import { useNftQueryParam } from "../filters/useCustomParam";
import NftCardMarket from "../nftcard/NftCardMarket";
import BundleCard from "./BundleCard";
import NextLink from "next/link";
import { BundleStatus } from "../../services/types/enum";

export default function Bundles() {
  const [showFilter, setShowFilter] = useState(false);
  const md = useBreakpointValue({ base: false, md: true });
  const { borderColor } = useCustomColors();
  const containerRef = useRef(null);
  const { user } = useSelector(selectProfile);
  const baseCols = [2, 4, 4, 5, 5];
  const col = useBreakpointValue(
    !md
      ? baseCols
      : baseCols.map((v, i) => {
          if (i > 1) {
            const newV = v - (showFilter ? 1 : 0);
            return newV;
          } else return v;
        })
  );
  // const size = (row || 3) * col;
  const {
    query,
    setQuery,
    countFilter,
    reset: resetQuery,
  } = useNftQueryParam();
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
    ["Bundle", query],
    async ({ pageParam }) => {
      const rs = await nftService.getBundles({
        desc: query.sort?.desc as "desc" | "asc",
        orderBy: query.sort?.orderBy,
        page: pageParam,
        search: query.search,
        chain: query.chain,
        collectionId: query.collectionId,
        maxPrice: query.maxPrice,
        minPrice: query.minPrice,
        paymentTokenId: query.paymentTokenId,
        status: BundleStatus.onSale,
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

  const bundles = useMemo(
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
    () => !isError && !isLoading && !isFetching && bundles.length === 0,
    [isError, isLoading, isFetching, bundles.length]
  );
  const { bgColor, textColor } = useCustomColors();

  return (
    <VStack px={0} spacing={5} w="full" alignItems="start">
      <Stack
        zIndex={10}
        position="sticky"
        top="60px"
        h="60px"
        direction="row"
        w="full"
        justifyContent="space-between"
        bg={bgColor}
      >
        <HStack>
          {md && (
            <Button
              onClick={() => {
                setShowFilter(!showFilter);
              }}
              leftIcon={showFilter && md ? <FiArrowLeft /> : <FiFilter />}
              lineHeight="base"
            >
              <HStack>
                <Text>Filter</Text>
                {countFilter() && (
                  <Box
                    w="1.5em"
                    h="1.5em"
                    justifyContent="center"
                    alignItems="center"
                    fontSize="xs"
                    rounded="full"
                    bg="gray"
                    color="white"
                  >
                    {countFilter()}
                  </Box>
                )}
              </HStack>
            </Button>
          )}
          {!md && (
            <NftsFilterMobileBtn
              options={BUNDLE_FILTER_OPTIONS}
              lineHeight="base"
            >
              <HStack>
                <Text>Filter</Text>
                {countFilter() && (
                  <Box
                    w="1.5em"
                    h="1.5em"
                    justifyContent="center"
                    alignItems="center"
                    fontSize="xs"
                    rounded="full"
                    bg="gray"
                    color="white"
                  >
                    {countFilter()}
                  </Box>
                )}
              </HStack>
            </NftsFilterMobileBtn>
          )}
          {countFilter() && <Button onClick={resetQuery}>Reset all</Button>}
        </HStack>
        <HStack>
          <IconButton
            isLoading={isFetching}
            onClick={() => {
              refetch();
            }}
            aria-label="refresh"
          >
            <FiRefreshCw />
          </IconButton>
          <Sort option="nft" />
        </HStack>
      </Stack>
      <HStack w="full" alignItems="start" spacing={[0, 3]}>
        {md && showFilter && (
          <Box
            position="sticky"
            border="1px solid"
            borderColor={borderColor}
            rounded="xl"
            minW="350px"
            w="350px"
            top="125px"
            height="calc( 100vh - 125px )"
            minH={500}
            overflow="hidden"
          >
            <NftsFilter options={BUNDLE_FILTER_OPTIONS} />
          </Box>
        )}
        <Box w="full">
          {isEmpty && (
            <Box w="full" py={10}>
              <EmptyState>
                <Button
                  onClick={() => {
                    refetch();
                  }}
                  isLoading={isLoading || isFetching}
                >
                  Try again
                </Button>
              </EmptyState>
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
          {!isError && !isEmpty && (
            <SimpleGrid
              ref={containerRef}
              justifyContent="center"
              w="full"
              columns={col}
              gap="15px"
              px={0}
            >
              {!isLoading &&
                bundles?.map((bundle) => (
                  <Link as={NextLink} href={`/bundle/${bundle.id}`}>
                    <BundleCard bundle={bundle} />
                  </Link>
                ))}
              {(((isLoading || isFetching) && bundles.length === 0) ||
                (hasNextPage && isFetchingNextPage)) &&
                Array.from(Array(col).keys()).map((k) => (
                  <NftCardMarket loading key={`nft-template-${k}`} />
                ))}
            </SimpleGrid>
          )}
          {!isLoading && !isFetching && hasNextPage && <div ref={loadingRef} />}
        </Box>
      </HStack>
    </VStack>
  );
}
