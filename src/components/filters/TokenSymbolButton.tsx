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
import id from "date-fns/esm/locale/id/index.js";
import { useEffect, useMemo, useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useSelector } from "react-redux";
import Icons from "../../images";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { selectSystem } from "../../store/systemSlice";
import { useNftQueryParam } from "./useCustomParam";

export default function TokenSymbolToken({
  onChangeToken,
  chain,
  ...rest
}: ButtonProps & {
  onChangeToken: (token: PaymentToken) => void;
  chain?: string;
}) {
  const { query, setQuery } = useNftQueryParam();
  const { paymentTokens } = useSelector(selectSystem);
  const paymentTokensSource = useMemo(() => {
    if (!chain) return paymentTokens;
    return paymentTokens.filter((p) => p.chain === chain);
  }, [chain, paymentTokens]);
  const [tokenSymbol, setTokenSymbol] = useState(
    paymentTokensSource[0]?.symbol
  );
  const [tokenId, setTokenId] = useState(paymentTokensSource[0]?.id);

  useEffect(() => {
    if (query.paymentTokenId) {
      const payment = paymentTokensSource.find(
        (p) => p.id === query.paymentTokenId
      );
      if (payment) {
        setTokenId(payment.id);
        setTokenSymbol(payment.symbol);
        onChangeToken(payment);
      }
    }
  }, [query.paymentTokenId]);
  useEffect(() => {
    setTokenId(paymentTokensSource[0]?.id);
    paymentTokensSource[0] && onChangeToken(paymentTokensSource[0]);
  }, [paymentTokensSource]);
  return (
    <Menu>
      <MenuButton {...rest} as={Button} rightIcon={<ChevronDownIcon />}>
        {tokenSymbol}
      </MenuButton>
      <MenuList>
        {paymentTokensSource.map((p) => {
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
