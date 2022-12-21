import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useMemo } from "react";
import { MarketType } from "../../services/types/enum";
import { useNftQueryParam } from "./useCustomParam";

export default function Sort({ option }: { option: "nft" | "collection" }) {
  const { query, setQuery } = useNftQueryParam();
  const OPTIONS = [
    {
      label: "Newest",
      onClick: () => {
        setQuery({
          sort: { orderBy: "updatedAt", desc: "desc" },
        });
      },
      key: "updatedAt_desc",
    },
    {
      label: "Price: low to high",
      onClick: () => {
        setQuery({
          sort: { orderBy: "price", desc: "asc" },
        });
      },
      key: "price_asc",
    },
    {
      label: "Price: high to low",
      onClick: () => {
        setQuery({
          sort: { orderBy: "price", desc: "desc" },
        });
      },
      key: "price_desc",
    },
  ];
  const OPTIONS_COLLECTION = [
    {
      label: "Newest",
      onClick: () => {
        setQuery({
          sort: { orderBy: "updatedAt", desc: "desc" },
        });
      },
      key: "updatedAt_desc",
    },
  ];
  const options = useMemo(
    () => (option === "nft" ? OPTIONS : OPTIONS_COLLECTION),
    [option]
  );
  const currentOption = useMemo(
    () =>
      options.find(
        (o) => o.key === `${query.sort?.orderBy}_${query.sort?.desc}`
      ) || options[0],
    [options, query.sort]
  );
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {currentOption?.label}
      </MenuButton>
      <MenuList zIndex={99}>
        {options.map((o, index) => (
          <MenuItem key={`sort-${index}`} onClick={o.onClick}>
            {o.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
