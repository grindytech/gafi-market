import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TokenSymbolToken from "./TokenSymbolButton";
import { useNftQueryParam } from "./useCustomParam";
export default function PriceFilter() {
  // const options = [
  //   { value: "BNB", label: "BNB", icon: <Icons.token.BNB /> },
  //   { value: "He", label: "He", icon: <Icons.token.HE /> },
  // ];
  const [min, setMin] = useState<string>();
  const [max, setMax] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();
  const { query, setQuery } = useNftQueryParam();
  useEffect(() => {
    setMin(query.minPrice ? String(query.minPrice) : "");
    setMax(query.maxPrice ? String(query.maxPrice) : "");
  }, [query.minPrice, query.maxPrice]);
  return (
    <VStack w="full" spacing={3} p={1}>
      <HStack w="full">
        <Input
          w="full"
          value={min}
          onChange={(e) => {
            setMin(e.target.value);
          }}
          type="number"
          placeholder="Min"
        />
        <Text colorScheme="gray">-</Text>
        <Input
          w="full"
          value={max}
          onChange={(e) => {
            setMax(e.target.value);
          }}
          type="number"
          placeholder="Max"
        />
        <Box>
          <TokenSymbolToken
            chain={query.chain}
            onChangeToken={(p) => {
              setTokenId(p.id);
            }}
          />
        </Box>
      </HStack>

      <Button
        onClick={() => {
          setQuery({
            ...query,
            minPrice: min ? Number(min) : undefined,
            maxPrice: max ? Number(max) : undefined,
            paymentTokenId: tokenId,
          });
        }}
        w="full"
      >
        Apply
      </Button>
    </VStack>
  );
}
