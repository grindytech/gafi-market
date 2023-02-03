import { Box, Button, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMemo, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import nftService from "../../services/nft.service";
import { Status } from "../../services/types/enum";
import useCustomColors from "../../theme/useCustomColors";
import { EmptyState, ErrorState } from "../EmptyState";
import GameCard from "./GameCard";
export default function Games({ statusAll = undefined }) {
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
    ["Games"],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getGames({
        page: pageParam,
        status: statusAll ? undefined : Status.Active,
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
  const games = useMemo(
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
    () => !isError && !isLoading && !isFetching && games.length === 0,
    [isError, isLoading, isFetching, games.length]
  );
  const { bgColor, textColor } = useCustomColors();

  return (
    <VStack px={0} spacing={5} w="full" alignItems="start">
      <HStack w="full" alignItems="start" spacing={0}>
        <VStack w="full" p={0}>
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
                columns={[2, 2, 3, 4, 5]}
                gap="15px"
                px={1}
              >
                {!isLoading &&
                  games.map((g) => {
                    return g ? (
                      <NextLink key={g.id} href={`/game/${g.key}`}>
                        <GameCard game={g} />
                      </NextLink>
                    ) : (
                      <></>
                    );
                  })}

                {(isLoading || isFetching) &&
                  games.length === 0 &&
                  Array.from(Array(12).keys()).map((k) => (
                    <GameCard isLoading key={`game-template-${k}`} />
                  ))}

                {hasNextPage &&
                  (isFetchingNextPage ? (
                    Array.from(Array(6).keys()).map((k) => (
                      <GameCard isLoading key={`game-template-${k}`} />
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
