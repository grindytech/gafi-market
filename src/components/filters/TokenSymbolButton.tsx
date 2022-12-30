import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonProps,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "react-query";
import systemService from "../../services/system.service";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import ChoosePaymentToken from "../paymentToken/ChoosePaymentoken";
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
  const [first, setFirst] = useState(true);
  const [selected, setSelected] = useState<PaymentToken>();
  const { data } = useQuery(
    ["TokenSymbolToken", query.paymentTokenId],
    async () => {
      const rs = await systemService.getPaymentToken(query.paymentTokenId);
      return rs.data;
    },
    {
      enabled: !!query.paymentTokenId && first,
      onSuccess: (data) => {
        setSelected(data);
        setFirst(false);
      },
    }
  );

  return (
    <Menu>
      <MenuButton {...rest} as={Button} rightIcon={<ChevronDownIcon />}>
        {selected?.symbol}
      </MenuButton>
      <MenuList>
        <ChoosePaymentToken
          chain={chain}
          selected={[selected]}
          onChange={(p) => {
            setSelected(p);
            onChangeToken(p);
          }}
        />
      </MenuList>
    </Menu>
  );
}
