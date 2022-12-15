import { IconButton, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { remove, selectBag, add } from "../../store/bagSlice";

export function AddToCartButton({ nft }: { nft: NftDto }) {
  const dispatch = useDispatch();
  const { items } = useSelector(selectBag);
  const isInCart = useMemo(
    () => !!items.find((i) => i.id === nft?.id && nft.sale?.id === i.sale.id),
    [items, nft]
  );
  const isDifferentChain = useMemo(
    () => items.length > 0 && items[0].chain.id !== nft.chain.id,
    [items, nft]
  );
  const isDifferentPaymentToken = useMemo(
    () =>
      items.length > 0 &&
      items[0].sale.paymentToken.id !== nft.sale.paymentToken.id,
    [items, nft]
  );
  return (
    <Tooltip
      label={
        isDifferentPaymentToken
          ? "Items from different payment token can't be purchased together"
          : isDifferentChain
          ? `Items from different chain can't be purchased together`
          : isInCart
          ? "Remove from cart"
          : "Put to cart"
      }
    >
      <IconButton
        disabled={isDifferentChain || isDifferentPaymentToken}
        onClick={(e) => {
          e.preventDefault();
          if (isInCart) {
            dispatch(remove({ id: nft.id }));
          } else {
            dispatch(add({ item: nft }));
          }
        }}
        aria-label="Add to cart"
      >
        {isInCart ? <FiX size="30px" /> : <FiPlus size="30px" />}
      </IconButton>
    </Tooltip>
  );
}
