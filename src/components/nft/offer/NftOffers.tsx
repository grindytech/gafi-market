import { Box, Button, HStack, Spinner, VStack } from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useSelector } from "react-redux";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";
import nftService from "../../../services/nft.service";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { selectProfile } from "../../../store/profileSlice";
import { EmptyState, ErrorState } from "../../EmptyState";
import OfferListItem from "./OfferListItem";

type Props = {
  nft?: NftDto;
  seller?: string;
  buyer?: string;
};
export default function NftOffers({ buyer, nft, seller }: Props) {
  const {
    data: offers,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["NftOffers", buyer, nft?.id, seller],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getOffers({
        buyer,
        seller,
        nft: nft?.id,
        page: pageParam,
        orderBy: "createdAt",
        desc: "desc",
        optional: true,
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
  const nftOffers = useMemo(
    () => offers?.pages.flatMap((page) => page.items) || [],
    [offers]
  );
  const loadingRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: loadingRef,
    onIntersect: fetchNextPage,
    enabled: !isLoading && !isFetching && hasNextPage,
  });
  const isEmpty = useMemo(
    () => !isError && !isLoading && !isFetching && nftOffers.length === 0,
    [isError, isLoading, isFetching, nftOffers.length]
  );
  const { user } = useSelector(selectProfile);
  const isOwner = useMemo(
    () => nft?.owner.address.toLowerCase() === user?.toLowerCase(),
    [nft, user]
  );
  return (
    <VStack spacing={0} w="full">
      {isEmpty && (
        <Box w="full">
          <EmptyState msg="Not offers yet" />
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
        nftOffers.map((offer) => (
          <Box p={2} w="full" _hover={{ boxShadow: "md" }}>
            <OfferListItem
              refetch={() => {
                refetch();
              }}
              nft={nft}
              isOwner={isOwner}
              offer={offer}
            />
          </Box>
        ))}
      {(isLoading || isFetching) &&
        nftOffers.length === 0 &&
        Array.from(Array(4).keys()).map((k) => (
          <OfferListItem
            refetch={() => {
              refetch();
            }}
            loading
            key={`nftOffers-template-${k}`}
          />
        ))}
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
    </VStack>
  );
}
