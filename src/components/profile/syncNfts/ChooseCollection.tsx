import { Box, CircularProgress, Text, VStack } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import nftService from "../../../services/nft.service";
import { NftCollectionDto } from "../../../services/types/dtos/NftCollectionDto";
import SearchBox from "../../SearchBox";
import CollectionItems from "./CollectionItems";

export default function ChooseCollection({
  onChoose,
}: {
  onChoose: (c: NftCollectionDto) => void;
}) {
  const [search, setSearch] = useState<string>();
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
    ["Collections", search],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getNftCollections({
        desc: "desc",
        orderBy: "createdAt",
        page: pageParam,
        search: search,
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

  return (
    <VStack px={0} spacing={5} w="full" alignItems="start">
      <Box w="full" px={1}>
        <SearchBox
          value={search}
          isLoading={isLoading}
          onChange={(v) => {
            setSearch(v);
          }}
          placeHolder="Search..."
        />
      </Box>
      <VStack w="full" px={1} overflow="auto" maxH={300}>
        <VStack w="full">
          {(isLoading || isFetching) &&
            Array.from(Array(3).keys()).map((k) => (
              <CollectionItems key={`CollectionItem-${k}`} loading={true} />
            ))}
          {!(isLoading || isFetching) &&
            nftCollections.length > 0 &&
            nftCollections.map((c) => {
              return (
                <Box
                  onClick={() => {
                    onChoose(c);
                  }}
                  w="full"
                >
                  <CollectionItems key={c.id} collection={c} />
                </Box>
              );
            })}

          {isEmpty && <Text textColor="gray">No collections found</Text>}
        </VStack>
        {!isLoading && !isFetching && hasNextPage && <div ref={loadingRef} />}
        <Box my={3}>
          {hasNextPage && (isFetchingNextPage ? <CircularProgress /> : <></>)}
        </Box>
      </VStack>
    </VStack>
  );
}
