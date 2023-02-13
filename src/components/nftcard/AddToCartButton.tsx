import { BoxProps, HStack, Icon, Text, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { ChainDto } from "../../services/types/dtos/ChainDto";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { add, remove, selectBag } from "../../store/bagSlice";

export function AddToCartButton({
  nft,
  showIcon,
  showText = true,
  ...rest
}: { nft: NftDto; showIcon?: boolean; showText?: boolean } & BoxProps) {
  const dispatch = useDispatch();
  const { items } = useSelector(selectBag);

  const isInCart = useMemo(
    () => !!items.find((i) => i.id === nft?.id && nft.sale?.id === i.sale.id),
    [items, nft]
  );
  const isDifferentChain = useMemo(
    () =>
      items.length > 0 &&
      (typeof nft.chain === "string"
        ? items[0].chain !== nft.chain
        : (items[0].chain as ChainDto)?.id !== (nft.chain as ChainDto)?.id),
    [items, nft]
  );
  const isDifferentPaymentToken = useMemo(
    () =>
      items.length > 0 &&
      (typeof nft.sale.paymentToken === "string"
        ? items[0].sale.paymentToken !== nft.sale.paymentToken
        : (items[0].sale.paymentToken as PaymentToken)?.id !==
          (nft.sale.paymentToken as PaymentToken)?.id),
    [items, nft]
  );
  return (
    <Tooltip
      label={
        isInCart
          ? "Remove from cart"
          : isDifferentPaymentToken
          ? "Items from different payment token can't be purchased together"
          : isDifferentChain
          ? `Items from different chain can't be purchased together`
          : "Put to cart"
      }
    >
      <HStack
        disabled={isDifferentChain || isDifferentPaymentToken}
        onClick={(e) => {
          e.preventDefault();
          if (isInCart) {
            dispatch(remove({ id: nft.id }));
          } else {
            if (isDifferentChain || isDifferentPaymentToken) return;
            dispatch(add({ item: nft }));
          }
        }}
        {...rest}
        color={
          isDifferentChain || isDifferentPaymentToken
            ? "gray.400"
            : isInCart
            ? "red.400"
            : "green.300"
        }
      >
        {showIcon && <Icon as={isInCart ? FiX : FiPlus} />}
        {showText && (
          <Text> {isInCart ? "Remove from cart" : "Add to cart"}</Text>
        )}
      </HStack>
    </Tooltip>
  );
}
