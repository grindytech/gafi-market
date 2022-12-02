import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useSelector } from "react-redux";
import Icons from "../../images";
import { selectSystem, setPaymentTokens } from "../../store/systemSlice";
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
          value={min}
          onChange={(e) => {
            setMin(e.target.value);
          }}
          type="number"
          placeholder="Min"
        />
        <Text colorScheme="gray">-</Text>
        <Input
          value={max}
          onChange={(e) => {
            setMax(e.target.value);
          }}
          type="number"
          placeholder="Max"
        />
        <Box w="full">
          <TokenSymbolToken
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
