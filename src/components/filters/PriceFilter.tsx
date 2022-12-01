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
import { useNftQueryParam } from "./useCustomParam";
export default function PriceFilter() {
  // const options = [
  //   { value: "BNB", label: "BNB", icon: <Icons.token.BNB /> },
  //   { value: "He", label: "He", icon: <Icons.token.HE /> },
  // ];
  const [min, setMin] = useState<string>();
  const [max, setMax] = useState<string>();
  const { paymentTokens } = useSelector(selectSystem);
  const [tokenSymbol, setTokenSymbol] = useState(paymentTokens[0]?.id);
  const [tokenId, setTokenId] = useState(paymentTokens[0]?.symbol);

  const options = paymentTokens.map((p) => {
    const icon = Icons.token[p.symbol.toUpperCase()];
    return {
      value: p.id,
      label: p.symbol,
      icon: (
        <Icon w={5} h={5}>
          {icon ? (
            icon()
          ) : (
            <Jazzicon
              diameter={20}
              seed={jsNumberForAddress(String(p.symbol))}
            />
          )}
        </Icon>
      ),
    };
  });
  const { query, setQuery } = useNftQueryParam();
  useEffect(() => {
    setMin(query.minPrice ? String(query.minPrice) : "");
    setMax(query.maxPrice ? String(query.maxPrice) : "");
    if (query.paymentTokenId) {
      const payment = paymentTokens.find((p) => p.id === query.paymentTokenId);
      if (payment) {
        setTokenId(payment.id);
        setTokenSymbol(payment.symbol);
      }
    }
  }, [query.minPrice, query.maxPrice, query.paymentTokenId]);
  useEffect(() => {
    setTokenId(paymentTokens[0]?.id);
    setTokenSymbol(paymentTokens[0]?.symbol);
  }, [paymentTokens]);
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
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {tokenSymbol}
            </MenuButton>
            <MenuList>
              {paymentTokens.map((p) => {
                const icon = Icons.token[p.symbol.toUpperCase()];
                return (
                  <MenuItem p={0} key={`PriceFilter-chain-${p.symbol}`}>
                    <Button
                      onClick={() => {
                        setTokenId(p.id);
                        setTokenSymbol(p.symbol);
                      }}
                      rounded={0}
                      variant="unstyled"
                      disabled={p.id === tokenId}
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
            </MenuList>
          </Menu>
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
