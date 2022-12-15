import { IconButton } from "@chakra-ui/react";
import { useMemo } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { remove, selectBag, add } from "../../store/bagSlice";

export function AddToCartButton({ nft }: { nft: NftDto }) {
  const dispatch = useDispatch();
  const { items } = useSelector(selectBag);
  const isInCart = useMemo(
    () => !!items.find((i) => i.id === nft.id),
    [items, nft]
  );
  return (
    <IconButton
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
  );
}
