import {
  Box,
  CircularProgress,
  CloseButton,
  HStack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import nftService from "../../services/nft.service";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import useCustomColors from "../../theme/useCustomColors";
import Avatar from "../Avatar";
import SearchBox from "../SearchBox";
import Skeleton from "../Skeleton";
import Properties from "./Properties";
import { useNftQueryParam } from "./useCustomParam";

const CollectionItem = ({
  c,
  loading,
  children,
  activated,
  ...rest
}: {
  c?: NftCollectionDto;
  loading?: boolean;
  activated?: boolean;
} & StackProps) => {
  const { borderColor } = useCustomColors();
  return (
    <HStack
      {...rest}
      w="full"
      p={2}
      rounded="xl"
      bg={activated ? borderColor : "none"}
      _hover={
        loading
          ? {}
          : {
              bg: borderColor,
            }
      }
      cursor="pointer"
      alignItems="center"
      justifyContent="space-between"
    >
      <HStack w="full">
        <Skeleton isLoaded={!loading}>
          <Avatar
            size="sm"
            src={c?.avatar}
            jazzicon={{
              seed: String(c?.name),
              diameter: 31,
            }}
          />
        </Skeleton>
        <Skeleton w="full" height="1em" isLoaded={!loading}>
          <Text>{c?.name}</Text>
        </Skeleton>
      </HStack>
      {children}
    </HStack>
  );
};

export default function NftCollectionsList({
  nftCollection,
  disableChange,
  game,
  showProperties = true,
}: {
  nftCollection?: string;
  disableChange?: boolean;
  game?: string;
  showProperties?: boolean;
}) {
  const [search, setSearch] = useState<string>();
  const { query, setQuery } = useNftQueryParam();
  const collectionId = nftCollection || query.collectionId;
  const {
    data,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    remove,
    refetch,
    isLoading,
  } = useInfiniteQuery(
    ["NftCollectionsList", search, nftCollection, game],
    async ({ pageParam = 1 }) => {
      if (!nftCollection) {
        const rs = await nftService.getNftCollections({
          game,
          search,
          page: pageParam,
        });
        return rs.data;
      } else {
        const rs = await nftService.getNftCollection(collectionId);
        return {
          total: 1,
          currentPage: 1,
          size: 1,
          pages: 1,
          hasNext: false,
          hasPrevious: false,
          items: [rs.data],
        };
      }
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
      retry: false,
    }
  );
  const collections = useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data]
  );
  const selected = useMemo(
    () => collections.find((c) => c.id === collectionId),
    [collections, collectionId]
  );

  const loadingRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: loadingRef,
    onIntersect: fetchNextPage,
    enabled: !isFetching && hasNextPage,
  });
  return selected ? (
    <VStack w="full">
      <CollectionItem activated c={selected}>
        {!disableChange && (
          <CloseButton
            onClick={() => {
              setQuery({
                collectionId: undefined,
                attributes: undefined,
              });
            }}
          />
        )}
      </CollectionItem>
      {showProperties && <Properties c={selected} />}
    </VStack>
  ) : (
    <VStack w="full">
      {!disableChange && (
        <SearchBox
          placeHolder="Search collections"
          value={search}
          onChange={(v) => {
            setSearch(v);
          }}
          isLoading={isLoading || isFetching}
        />
      )}
      <VStack w="full" spacing={2} overflow="auto" maxH={300}>
        <VStack w="full">
          {(isLoading || isFetching) &&
            Array.from(Array(3).keys()).map((k) => (
              <CollectionItem key={`CollectionItem-${k}`} loading={true} />
            ))}
          {!(isLoading || isFetching) &&
            collections.length > 0 &&
            collections.map((c) => {
              return (
                <CollectionItem
                  onClick={() => {
                    setQuery({
                      collectionId: c?.id,
                    });
                  }}
                  key={c.id}
                  c={c}
                />
              );
            })}

          {!(isLoading || isFetching) && collections.length === 0 && (
            <Text textColor="gray">No collections found</Text>
          )}
        </VStack>
        {!isLoading && !isFetching && hasNextPage && <div ref={loadingRef} />}
        <Box my={3}>
          {hasNextPage && (isFetchingNextPage ? <CircularProgress /> : <></>)}
        </Box>
      </VStack>
    </VStack>
  );
}
