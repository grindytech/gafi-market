import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiFilter, FiRefreshCw } from "react-icons/fi";
import { useInfiniteQuery } from "react-query";
import {
  BooleanParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import nftService from "../../services/nft.service";
import { MarketType } from "../../services/types/enum";
import useCustomColors from "../../theme/useCustomColors";
import NftsFilter from "../filters/NftsFilter";
import NftCardMarket from "../nftcard/NftCardMarket";
import SearchBox from "../SearchBox";

export default function Nfts() {
  const [showFilter, setShowFilter] = useState(false);
  const md = useBreakpointValue({ base: false, md: true });
  const { borderColor } = useCustomColors();
  const [query, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    size: withDefault(NumberParam, 1),
    maxPrice: NumberParam,
    minPrice: NumberParam,
    search: withDefault(StringParam, ""),
    desc: withDefault(StringParam, "asc"),
    orderBy: withDefault(StringParam, "price"),
    blacklist: BooleanParam,
    attributes: withDefault(StringParam, ""), //format: json
    chain: StringParam,
    collectionId: StringParam,
    game: StringParam,
    marketType: StringParam, // withDefault(StringParam, "OnSale"),
  });
  const {
    data: nftsRsp,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    remove,
    refetch,
    isLoading,
  } = useInfiniteQuery(
    ["Nfts", query],
    async ({ pageParam = 1 }) => {
      const rs = await nftService.getNfts({
        desc: query.desc as "desc" | "asc",
        orderBy: query.orderBy,
        page: pageParam,
        search: query.search,
        size: query.size,
        attributes: query.attributes ?? JSON.parse(query.attributes),
        chain: query.chain,
        collectionId: query.collectionId,
        game: query.game,
        marketType: query.marketType as MarketType,
        maxPrice: query.maxPrice,
        minPrice: query.minPrice,
      });
      return rs.data;
    },

    {
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage.hasPrevious ? firstPage.currentPage - 1 : undefined,
      onSuccess: () => {
        // if (query.search) {
        //   sendGAEvent("mp_search_keyword", { key_work: query.search });
        // }
      },
      onError: (error) => {
        console.error(error);
        // setError(true);
      },
      retry: false,
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
    enabled: !isFetching && hasNextPage,
  });
  return (
    <VStack spacing={5} w="full" alignItems="start">
      <Stack direction="row" w="full" justifyContent="space-between">
        <HStack>
          <Button
            onClick={() => {
              setShowFilter(!showFilter);
            }}
            leftIcon={showFilter && md ? <FiArrowLeft /> : <FiFilter />}
            lineHeight="base"
          >
            Filter
          </Button>
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
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Recently listed
            </MenuButton>
            <MenuList>
              <MenuItem>Recently listed</MenuItem>
              <MenuItem>Price: low to high</MenuItem>
              <MenuItem>Price: high to low</MenuItem>
            </MenuList>
          </Menu>
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
          top="10px"
          height="calc( 100vh - 160px )"
          minH={500}
          mr={3}
          overflow="hidden"
        >
          <NftsFilter />
        </Box>
        <Box w="full">
          <SimpleGrid
            justifyContent="center"
            w="full"
            columns={showFilter && md ? [1, 1, 2, 3, 4] : [1, 2, 3, 4, 6]}
            gap="15px"
          >
            {!(isLoading || isFetching) &&
              marketNfts.map((nft) => {
                return nft ? <NftCardMarket nft={nft} key={nft.id} /> : <></>;
              })}
            {(isLoading || isFetching) &&
              Array.from(Array(12).keys()).map((k) => (
                <NftCardMarket loading key={`nft-template-${k}`} />
              ))}
          </SimpleGrid>
          <div ref={loadingRef} />
          <Box my={3}>
            {hasNextPage && (isFetchingNextPage ? <CircularProgress /> : <></>)}
          </Box>
        </Box>
      </HStack>
    </VStack>
  );
}
