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
import React, { useState } from "react";
import Icons from "../../images";
export default function PriceFilter() {
  const options = [
    { value: "BNB", label: "BNB", icon: <Icons.token.BNB /> },
    { value: "He", label: "He", icon: <Icons.token.HE /> },
  ];
  const [token, setToken] = useState("BNB");
  const [min, setMin] = useState<string>();
  const [max, setMax] = useState<string>();

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
              {token}
            </MenuButton>
            <MenuList>
              {options.map(({ value, label, icon }) => (
                <MenuItem p={0} key={`PriceFilter-chain-${value}`}>
                  <Button
                    onClick={() => {
                      setToken(value);
                    }}
                    rounded={0}
                    variant="unstyled"
                    disabled={value === token}
                  >
                    <HStack
                      py={1}
                      px={2}
                      w="full"
                      justifyContent="start"
                      alignItems="center"
                      lineHeight="1em"
                    >
                      <Icon w={6} h={6}>
                        {React.cloneElement(icon)}
                      </Icon>
                      <Text>{label}</Text>
                    </HStack>
                  </Button>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </HStack>

      <Button w="full">Apply</Button>
    </VStack>
  );
}
