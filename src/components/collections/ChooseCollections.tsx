import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Icon,
  MenuItem,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import nftService from "../../services/nft.service";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import Avatar from "../Avatar";
import EmptyState, { ErrorState } from "../EmptyState";
import SearchBox from "../SearchBox";

type Props = {
  selected: NftCollectionDto[];
  onChange: (c: NftCollectionDto) => void;
};
export default function ChooseCollections({ onChange, selected }: Props) {
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
    ["ChooseCollections", search],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getNftCollections({
        search,
        page: pageParam,
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
  const collections = useMemo(
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
    () => !isError && !isLoading && !isFetching && collections.length === 0,
    [isError, isLoading, isFetching, collections.length]
  );
  const [select, setSelect] = useState<NftCollectionDto>();
  useEffect(() => {
    if (!select && collections.length > 0) {
      onChange((selected && selected[0]) || collections[0]);
    }
  }, [select, collections]);
  return (
    <VStack w="full">
      <Box p={1}>
        <SearchBox
          placeHolder="search..."
          value={search}
          onChange={(s) => {
            setSearch(s);
          }}
        />
      </Box>
      <VStack w="full">
        {isEmpty && (
          <Box w="full" py={10}>
            <EmptyState />
          </Box>
        )}
        {isError && (
          <Box w="full" py={10}>
            <ErrorState />
          </Box>
        )}
        {!isError &&
          !isEmpty &&
          collections.map((c) => {
            const isSelected = !!selected.find(
              (collection) => collection?.id === c.id
            );
            return (
              <MenuItem as={Box} p={0} key={`ChooseToken-${c.id}`}>
                <Button
                  onClick={() => {
                    onChange(c);
                    setSelect(c);
                  }}
                  rounded={0}
                  variant="ghost"
                  disabled={isSelected}
                  rightIcon={isSelected ? <Icon as={CheckIcon} /> : <></>}
                  w="full"
                >
                  <HStack
                    py={1}
                    px={2}
                    w="full"
                    justifyContent="start"
                    alignItems="center"
                    lineHeight="1em"
                  >
                    <Avatar
                      w="24px"
                      h="24px"
                      src={c.avatar}
                      jazzicon={{
                        diameter: 24,
                        seed: c.key,
                      }}
                    />

                    <VStack spacing={0} alignItems="start">
                      <Text>{c.name}</Text>
                      <Text color="gray" fontSize="xs">
                        {c.key}
                      </Text>
                    </VStack>
                  </HStack>
                </Button>
              </MenuItem>
            );
          })}
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
    </VStack>
  );
}
