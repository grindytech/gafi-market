import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  HStack,
  Icon,
  Text,
  ButtonProps,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useSelector } from "react-redux";
import Icons from "../../images";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { selectSystem } from "../../store/systemSlice";
import { useNftQueryParam } from "./useCustomParam";

export default function TokenSymbolToken({
  onChangeToken,
  ...rest
}: ButtonProps & {
  onChangeToken: (token: PaymentToken) => void;
}) {
  const { query, setQuery } = useNftQueryParam();
  const { paymentTokens } = useSelector(selectSystem);
  const [tokenSymbol, setTokenSymbol] = useState(paymentTokens[0]?.symbol);
  const [tokenId, setTokenId] = useState(paymentTokens[0]?.id);

  useEffect(() => {
    if (query.paymentTokenId) {
      const payment = paymentTokens.find((p) => p.id === query.paymentTokenId);
      if (payment) {
        setTokenId(payment.id);
        setTokenSymbol(payment.symbol);
        onChangeToken(payment);
      }
    }
  }, [query.paymentTokenId]);
  useEffect(() => {
    setTokenId(paymentTokens[0]?.id);
    paymentTokens[0] && onChangeToken(paymentTokens[0]);
  }, [paymentTokens]);
  return (
    <Menu>
      <MenuButton {...rest} as={Button} rightIcon={<ChevronDownIcon />}>
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
                  onChangeToken(p);
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
  );
}
