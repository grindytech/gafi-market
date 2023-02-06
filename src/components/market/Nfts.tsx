import {
  Box,
  Button,
  HStack,
  IconButton,
  MenuItem,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiFilter, FiRefreshCw } from "react-icons/fi";
import { useInfiniteQuery } from "react-query";

import NextLink from "next/link";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import nftService from "../../services/nft.service";
import { MarketType } from "../../services/types/enum";
import useCustomColors from "../../theme/useCustomColors";
import { EmptyState, ErrorState } from "../EmptyState";
import NftsFilter, {
  NftsFilterMobileBtn,
  NFTS_FILTER_OPTIONS,
} from "../filters/NftsFilter";
import Sort from "../filters/Sort";
import { useNftQueryParam } from "../filters/useCustomParam";
import NftCardMarket from "../nftcard/NftCardMarket";
import SyncNfts from "../profile/syncNfts/SyncNfts";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profileSlice";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import CreateBundle, { CreateBundleMobile } from "./CreateBundle";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";

export default function Nfts({
  owner,
  enableFilter,
  hideLoadMore,
  row,
  status,
  nftCollection,
  game,
}: {
  owner?: string;
  enableFilter?: boolean;
  hideLoadMore?: boolean;
  row?: number;
  status?: MarketType;
  nftCollection?: string;
  game?: string;
}) {
  const [showFilter, setShowFilter] = useState(false);
  const md = useBreakpointValue({ base: false, md: true });
  const { borderColor } = useCustomColors();
  const containerRef = useRef(null);
  const { user } = useSelector(selectProfile);
  const [bundleItems, setBundleItems] = useState<NftDto[]>([]);
  const [createBundleMode, setCreateBundleMode] = useState(false);
  const [bundleCollection, setBundleCollection] = useState<string>();
  const maxBundleItem = 50;
  useEffect(() => {
    if (bundleItems.length === 0) {
      setBundleCollection(undefined);
    } else {
      const c = bundleItems[0].nftCollection;
      setBundleCollection(typeof c === "string" ? c : c?.id);
    }
  }, [bundleItems]);
  const baseCols = [2, 4, 4, 5, 6];
  const col = useBreakpointValue(
    !md
      ? baseCols
      : baseCols.map((v, i) => {
          if (i > 1) {
            const newV = v - (showFilter ? 1 : 0) - (createBundleMode ? 1 : 0);
            return newV;
          } else return v;
        })
  );
  const size = (row || 3) * col;

  const {
    query,
    setQuery,
    countFilter,
    reset: resetQuery,
  } = useNftQueryParam();
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
    ["Nfts", query, owner, nftCollection, status, size, hideLoadMore, game],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getNfts({
        desc: query.sort?.desc as "desc" | "asc",
        orderBy: query.sort?.orderBy,
        page: pageParam,
        search: query.search,
        size: size,
        attributes: query.attributes,
        chain: query.chain,
        collectionId: nftCollection || query.collectionId,
        marketType: status || (query.marketType as MarketType),
        maxPrice: query.maxPrice,
        minPrice: query.minPrice,
        paymentTokenId: query.paymentTokenId,
        owner: owner,
        game,
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

  const { bgColor, textColor } = useCustomColors();

  return (
    <VStack px={0} spacing={5} w="full" alignItems="start">
      {enableFilter && (
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
                collectionProps={
                  nftCollection && {
                    disableChange: true,
                    nftCollection: nftCollection,
                    game,
                  }
                }
                options={NFTS_FILTER_OPTIONS}
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
            {owner === user && (
              <SyncNfts
                onSuccess={() => {
                  refetch();
                }}
              />
            )}
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
      )}
      <HStack w="full" alignItems="start" spacing={[0, 3]}>
        {enableFilter && md && showFilter && (
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
            <NftsFilter
              collectionProps={{
                disableChange: !!nftCollection,
                nftCollection,
                game,
              }}
              options={NFTS_FILTER_OPTIONS.filter(
                (o) => !status || o !== "marketStatus"
              )}
            />
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
                marketNfts.map((nft) => {
                  const sameBundleCollection =
                    bundleCollection === nft.nftCollection ||
                    bundleCollection ===
                      (nft.nftCollection as NftCollectionDto)?.id;
                  const isMaxLength = bundleItems.length >= maxBundleItem;
                  const isSelected = !!bundleItems.find((b) => b.id === nft.id);
                  return nft ? (
                    <Box key={`bundle item ${nft.id}`} position="relative">
                      {createBundleMode && (
                        <Box
                          zIndex={9}
                          cursor="pointer"
                          onClick={(e) => {
                            if (createBundleMode) {
                              e.preventDefault();
                              e.stopPropagation();
                              if (
                                (bundleCollection && !sameBundleCollection) ||
                                (isMaxLength && !isSelected)
                              ) {
                                return;
                              }
                              if (bundleItems.find((b) => b.id === nft.id)) {
                                const newItems = Array.from(
                                  bundleItems.filter((b) => b.id !== nft.id)
                                );
                                setBundleItems(newItems);
                              } else {
                                setBundleItems(
                                  Array.from([...bundleItems, nft])
                                );
                              }
                            }
                          }}
                          position="absolute"
                          w="full"
                          h="full"
                        >
                          <Tooltip
                            label={
                              createBundleMode
                                ? bundleCollection && !sameBundleCollection
                                  ? "You can only select items from the same collection"
                                  : !!nft.bundle
                                  ? "This item actually in a bundle"
                                  : isMaxLength && !isSelected
                                  ? "Maximum items in a bundle is " +
                                    maxBundleItem
                                  : ""
                                : ""
                            }
                          >
                            <Box w="full" h="full"></Box>
                          </Tooltip>
                        </Box>
                      )}

                      <NextLink
                        key={`${nft.nftContract}:${nft.tokenId}`}
                        href={`/nft/${nft.nftContract}:${nft.tokenId}`}
                      >
                        <NftCardMarket
                          disabled={
                            createBundleMode &&
                            ((bundleCollection && !sameBundleCollection) ||
                              !!nft.bundle ||
                              (isMaxLength && !isSelected))
                          }
                          selected={isSelected}
                          showMenu={!createBundleMode}
                          menuItems={
                            owner === user &&
                            !nft.bundle && (
                              <MenuItem
                                onClick={() => {
                                  setCreateBundleMode(true);
                                  setBundleItems([nft]);
                                }}
                              >
                                Sale as bundle
                              </MenuItem>
                            )
                          }
                          onCancelSale={() => {
                            refetch();
                          }}
                          onSale={() => {
                            refetch();
                          }}
                          onBuy={() => {
                            refetch();
                          }}
                          nft={nft}
                        />
                      </NextLink>
                    </Box>
                  ) : (
                    <></>
                  );
                })}

              {(((isLoading || isFetching) && marketNfts.length === 0) ||
                (hasNextPage && isFetchingNextPage)) &&
                Array.from(Array(col).keys()).map((k) => (
                  <NftCardMarket loading key={`nft-template-${k}`} />
                ))}
            </SimpleGrid>
          )}
          {!hideLoadMore && !isLoading && !isFetching && hasNextPage && (
            <div ref={loadingRef} />
          )}
        </Box>
        {createBundleMode &&
          (md ? (
            <Box
              display={md && createBundleMode ? "block" : "none"}
              position="sticky"
              border="1px solid"
              borderColor={borderColor}
              rounded="xl"
              minW="350px"
              w="350px"
              top="125px"
              height="calc( 100vh - 60px )"
              minH={500}
              overflow="hidden"
            >
              <CreateBundle
                items={bundleItems}
                onClose={() => {
                  setBundleItems([]);
                  setCreateBundleMode(false);
                }}
                onRemove={(nftId) => {
                  setBundleItems(
                    Array.from(bundleItems.filter((b) => b.id !== nftId))
                  );
                }}
                onReset={() => {
                  setBundleItems([]);
                }}
              />
            </Box>
          ) : (
            <CreateBundleMobile
              items={bundleItems}
              onClose={() => {
                setBundleItems([]);
                setCreateBundleMode(false);
              }}
              onRemove={(nftId) => {
                setBundleItems(
                  Array.from(bundleItems.filter((b) => b.id !== nftId))
                );
              }}
              onReset={() => {
                setBundleItems([]);
              }}
            />
          ))}
      </HStack>
    </VStack>
  );
}
