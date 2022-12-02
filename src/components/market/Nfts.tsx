import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CircularProgress,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiFilter, FiRefreshCw } from "react-icons/fi";
import { useInfiniteQuery } from "react-query";

import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import nftService from "../../services/nft.service";
import { MarketType } from "../../services/types/enum";
import useCustomColors from "../../theme/useCustomColors";
import { EmptyState, ErrorState } from "../EmptyState";
import NftsFilter, { NftsFilterMobileBtn } from "../filters/NftsFilter";
import Sort from "../filters/Sort";
import { useNftQueryParam } from "../filters/useCustomParam";
import NftCardMarket from "../nftcard/NftCardMarket";

export default function Nfts({ owner }: { owner?: string }) {
  const [showFilter, setShowFilter] = useState(false);
  const md = useBreakpointValue({ base: false, md: true });
  const { borderColor } = useCustomColors();
  const { query, setQuery, fixedProperties } = useNftQueryParam();
  const countFilter = () =>
    Object.keys(query).filter((k) => !!query[k]).length - fixedProperties;
  const {
    data: nftsRsp,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["Nfts", JSON.stringify(query),owner],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getNfts({
        desc: query.desc as "desc" | "asc",
        orderBy: query.orderBy,
        page: pageParam,
        search: query.search,
        size: query.size,
        attributes: query.attributes,
        chain: query.chain,
        collectionId: query.collectionId,
        game: query.game,
        marketType: query.marketType as MarketType,
        maxPrice: query.maxPrice,
        minPrice: query.minPrice,
        paymentTokenId: query.paymentTokenId,
        owner: owner,
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
  const marketNfts = useMemo(
    () => nftsRsp?.pages.flatMap((page) => page.items) || [],
    [nftsRsp]
  );

  const loadingRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: loadingRef,
    onIntersect: fetchNextPage,
    enabled: !isLoading && !isFetching && hasNextPage,
  });

  const isEmpty = useMemo(
    () => !isError && !isLoading && !isFetching && marketNfts.length === 0,
    [isError, isLoading, isFetching, marketNfts.length]
  );

  return (
    <VStack spacing={5} w="full" alignItems="start">
      <Stack direction="row" w="full" justifyContent="space-between">
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
            <NftsFilterMobileBtn lineHeight="base">
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
          {countFilter() && (
            <Button
              onClick={() => {
                setQuery(
                  {
                    page: 1,
                    size: 18,
                    desc: "desc",
                    orderBy: "price",
                    attributes: [],
                    chain: "",
                    marketType: "",
                  },
                  "replace"
                );
              }}
            >
              Reset all
            </Button>
          )}
        </HStack>
        <HStack>
          <IconButton
            isLoading={isFetching}
            onClick={() => {
              setQuery({ ...query, page: 1 });
              refetch();
            }}
            aria-label="refresh"
          >
            <FiRefreshCw />
          </IconButton>
          <Sort />
        </HStack>
      </Stack>
      <HStack w="full" alignItems="start" spacing={0}>
        <Box
          display={md && showFilter ? "block" : "none"}
          position="sticky"
          border="1px solid"
          borderColor={borderColor}
          rounded="xl"
          minW="350px"
          w="350px"
          top="30px"
          height="calc( 100vh - 60px )"
          minH={500}
          mr={3}
          overflow="hidden"
        >
          <NftsFilter />
        </Box>
        <Box w="full">
          {isEmpty && (
            <Box w="full" py={10}>
              <EmptyState>
                <Button
                  onClick={() => {
                    refetch();
                  }}
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
          <SimpleGrid
            justifyContent="center"
            w="full"
            columns={showFilter && md ? [1, 1, 2, 3, 4] : [1, 2, 3, 4, 6]}
            gap="15px"
          >
            {!isLoading &&
              marketNfts.map((nft) => {
                return nft ? <NftCardMarket nft={nft} key={nft.id} /> : <></>;
              })}

            {(isLoading || isFetching) &&
              marketNfts.length === 0 &&
              Array.from(Array(12).keys()).map((k) => (
                <NftCardMarket loading key={`nft-template-${k}`} />
              ))}
          </SimpleGrid>
          {!isLoading && !isFetching && hasNextPage && <div ref={loadingRef} />}
          <Box my={3}>
            {hasNextPage &&
              (isFetchingNextPage ? (
                <HStack py={3} w="full" justifyContent="center">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    // emptyColor="gray.200"
                    // color="blue.500"
                    size="lg"
                  />
                </HStack>
              ) : (
                <></>
              ))}
          </Box>
        </Box>
      </HStack>
    </VStack>
  );
}
