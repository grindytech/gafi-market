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
          ...query,
          orderBy: "updatedAt",
          desc: "desc",
          sort: 0,
          marketType: "",
        });
      },
    },
    {
      label: "Recently listed",
      onClick: () => {
        setQuery({
          ...query,
          orderBy: "updatedAt",
          desc: "desc",
          marketType: MarketType.OnSale,
          sort: 1,
        });
      },
    },
    {
      label: "Price: low to high",
      onClick: () => {
        setQuery({
          ...query,
          orderBy: "price",
          desc: "asc",
          marketType: MarketType.OnSale,
          sort: 2,
        });
      },
    },
    {
      label: "Price: high to low",
      onClick: () => {
        setQuery({
          ...query,
          orderBy: "price",
          desc: "desc",
          marketType: MarketType.OnSale,
          sort: 3,
        });
      },
    },
  ];
  const OPTIONS_COLLECTION = [
    {
      label: "Newest",
      onClick: () => {
        setQuery({
          ...query,
          orderBy: "updatedAt",
          desc: "desc",
          sort: 0,
          marketType: "",
        });
      },
    },
  ];
  const options = useMemo(
    () => (option === "nft" ? OPTIONS : OPTIONS_COLLECTION),
    [option]
  );
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {options[query.sort].label}
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
