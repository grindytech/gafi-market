import {
  Box,
  Button,
  HStack,
  IconButton,
  SimpleGrid,
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
import useCustomColors from "../../theme/useCustomColors";
import { EmptyState, ErrorState } from "../EmptyState";
import NftsFilter, {
  COLLECTIONS_FILTER_OPTIONS,
  NftsFilterMobileBtn,
} from "../filters/NftsFilter";
import Sort from "../filters/Sort";
import { useNftQueryParam } from "../filters/useCustomParam";
import NextLink from "next/link";
import NftCollectionCard from "./NftCollectionCard";
export default function Collections() {
  const {
    query,
    setQuery,
    countFilter,
    reset: resetQuery,
  } = useNftQueryParam();
  console.log(query);
  const [showFilter, setShowFilter] = useState(false);
  const md = useBreakpointValue({ base: false, md: true });
  const { borderColor } = useCustomColors();
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
    ["Nfts", JSON.stringify(query)],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getNftCollections({
        desc: query.desc as "desc" | "asc",
        orderBy: query.orderBy,
        page: pageParam,
        search: query.search,
        size: query.size,
        chain: query.chain,
        game: query.game,
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
  const nftCollections = useMemo(
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
    () => !isError && !isLoading && !isFetching && nftCollections.length === 0,
    [isError, isLoading, isFetching, nftCollections.length]
  );
  const { bgColor, textColor } = useCustomColors();

  return (
    <VStack px={0} spacing={5} w="full" alignItems="start">
      <HStack w="full" alignItems="start" spacing={0}>
        <Box
          display={md && showFilter ? "block" : "none"}
          position="sticky"
          border="1px solid"
          borderColor={borderColor}
          rounded="xl"
          minW="350px"
          w="350px"
          top="65px"
          height="calc( 100vh - 60px )"
          minH={500}
          mr={3}
          overflow="hidden"
        >
          <NftsFilter options={COLLECTIONS_FILTER_OPTIONS} />
        </Box>
        <VStack w="full" p={0}>
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
                  options={COLLECTIONS_FILTER_OPTIONS}
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
                  setQuery({ ...query, page: 1 });
                  refetch();
                }}
                aria-label="refresh"
              >
                <FiRefreshCw />
              </IconButton>
              <Sort option="collection" />
            </HStack>
          </Stack>
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
                justifyContent="center"
                w="full"
                columns={showFilter && md ? [2, 2, 3, 3, 5] : [2, 2, 3, 4, 5]}
                gap="15px"
                px={1}
              >
                {!isLoading &&
                  nftCollections.map((c) => {
                    return c ? (
                      <NextLink key={c.id} href={`/collection/${c.id}`}>
                        <NftCollectionCard collection={c} />
                      </NextLink>
                    ) : (
                      <></>
                    );
                  })}

                {(isLoading || isFetching) &&
                  nftCollections.length === 0 &&
                  Array.from(Array(12).keys()).map((k) => (
                    <NftCollectionCard isLoading key={`nft-template-${k}`} />
                  ))}

                {hasNextPage &&
                  (isFetchingNextPage ? (
                    Array.from(Array(6).keys()).map((k) => (
                      <NftCollectionCard isLoading key={`nft-template-${k}`} />
                    ))
                  ) : (
                    <></>
                  ))}
              </SimpleGrid>
            )}
            {!isLoading && !isFetching && hasNextPage && (
              <div ref={loadingRef} />
            )}
          </Box>
        </VStack>
      </HStack>
    </VStack>
  );
}