import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { AttributeMap } from "../../services/types/dtos/AttributeMap";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import { AttributesMapType } from "../../services/types/enum";
import useCustomColors from "../../theme/useCustomColors";
import SearchBox from "../SearchBox";

const PropertyString = ({ attrMap }: { attrMap: AttributeMap }) => {
  return (
    <CheckboxGroup colorScheme="primary">
      <VStack w="full" alignItems="start">
        {attrMap.options?.map((option) => {
          return <Checkbox value={option}>{option}</Checkbox>;
        })}
      </VStack>
    </CheckboxGroup>
  );
};
const PropertyBoolean = ({ attrMap }: { attrMap: AttributeMap }) => {
  return (
    <RadioGroup colorScheme="primary">
      <HStack spacing={3}>
        <Radio value={""}>All</Radio>
        <Radio value={"true"}>True</Radio>
        <Radio value={"false"}>False</Radio>
      </HStack>
    </RadioGroup>
  );
};
const PropertyNumber = ({ attrMap }: { attrMap: AttributeMap }) => {
  const [min, setMin] = useState<string>();
  const [max, setMax] = useState<string>();
  return (
    <VStack w="full">
      <HStack w="full">
        <Input
          value={min}
          onChange={(e) => {
            setMin(e.target.value);
          }}
          type="number"
          placeholder={String(attrMap.min)}
        />
        <Text colorScheme="gray">-</Text>
        <Input
          value={max}
          onChange={(e) => {
            setMax(e.target.value);
          }}
          type="number"
          placeholder={String(attrMap.max)}
        />
      </HStack>
      <Button w="full">Apply</Button>
    </VStack>
  );
};

export default function Properties({ c }: { c: NftCollectionDto }) {
  const [search, setSearch] = useState<string>();
  const { borderColor } = useCustomColors();
  return (
    c.attributesMap &&
    c.attributesMap.length > 0 && (
      <VStack w="full">
        <SearchBox
          placeHolder="Properties..."
          value={search}
          onChange={(v) => {
            setSearch(v);
          }}
        />
        <VStack w="full">
          <Accordion allowMultiple w="full">
            {c.attributesMap.map((attr) => (
              <AccordionItem
                borderWidth="1px"
                p={2}
                rounded="xl"
                borderColor={borderColor}
                mb={2}
                display={
                  !search ||
                  attr.key.toLowerCase().includes(search.toLowerCase())
                    ? "block"
                    : "none"
                }
                key={`${c.id}-${attr.key}`}
              >
                <AccordionButton
                  w="full"
                  justifyContent="space-between"
                  px={0}
                  _hover={{
                    bg: "none",
                  }}
                >
                  <Heading fontSize="lg">{attr.label}</Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel
                  w="full"
                  pb={2}
                  px={2}
                  maxH={200}
                  overflow="auto"
                >
                  {attr.type === AttributesMapType.String && (
                    <PropertyString attrMap={attr} />
                  )}
                  {attr.type === AttributesMapType.Number && (
                    <PropertyNumber attrMap={attr} />
                  )}
                  {attr.type === AttributesMapType.Boolean && (
                    <PropertyBoolean attrMap={attr} />
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      </VStack>
    )
  );
}
