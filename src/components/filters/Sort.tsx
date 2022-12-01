import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { MarketType } from "../../services/types/enum";
import { useNftQueryParam } from "./useCustomParam";

export default function Sort() {
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
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {OPTIONS[query.sort].label}
      </MenuButton>
      <MenuList>
        {OPTIONS.map((o, index) => (
          <MenuItem key={`sort-${index}`} onClick={o.onClick}>
            {o.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
