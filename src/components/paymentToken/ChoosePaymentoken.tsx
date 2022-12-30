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
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { useInfiniteQuery } from "react-query";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import Icons from "../../images";
import systemService from "../../services/system.service";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { EmptyState, ErrorState } from "../EmptyState";
import SearchBox from "../SearchBox";

export default function ChoosePaymentToken({
  chain,
  selected,
  onChange,
}: {
  chain: string;
  selected: PaymentToken[];
  onChange: (s: PaymentToken) => void;
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
    ["ChoosePaymentToken", chain, search],
    async ({ pageParam = 1 }) => {
      const rs = await systemService.getPaymentTokens({
        chain,
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
  const paymentTokens = useMemo(
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
    () => !isError && !isLoading && !isFetching && paymentTokens.length === 0,
    [isError, isLoading, isFetching, paymentTokens.length]
  );
  const [select, setSelect] = useState<PaymentToken>();
  useEffect(() => {
    if (!select && paymentTokens.length > 0) {
      onChange((selected && selected[0]) || paymentTokens[0]);
    }
  }, [select, paymentTokens]);
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
          paymentTokens.map((p) => {
            const icon = Icons.token[p.symbol.toUpperCase()];
            const isSelected = !!selected.find((token) => token?.id === p.id);
            return (
              <MenuItem as={Box} p={0} key={`ChooseToken-${p.id}`}>
                <Button
                  onClick={() => {
                    onChange(p);
                    setSelect(p);
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
                    {icon ? (
                      <Icon w={6} h={6}>
                        {icon()}
                      </Icon>
                    ) : (
                      <Jazzicon
                        diameter={24}
                        seed={jsNumberForAddress(String(p.symbol))}
                      />
                    )}
                    <Text>{p.symbol}</Text>
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
