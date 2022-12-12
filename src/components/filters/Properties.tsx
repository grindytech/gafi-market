import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { StringParam, useQueryParam } from "use-query-params";
import { AttributeMap } from "../../services/types/dtos/AttributeMap";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import { AttributesMapType } from "../../services/types/enum";
import { GetNftAttributes } from "../../services/types/params/GetNftAttributes";
import useCustomColors from "../../theme/useCustomColors";
import SearchBox from "../SearchBox";
import { useNftQueryParam } from "./useCustomParam";

const CustomAccordionItem = ({
  title,
  onClear,
  showClearBtn,
  children,
  count,
}: {
  title: string;
  onClear: () => void;
  showClearBtn?: boolean;
  children: any;
  count?: (() => number) | number;
}) => {
  const { borderColor } = useCustomColors();
  const getCount = () => {
    if (typeof count === "function") {
      return count();
    }
    return count;
  };
  return (
    <AccordionItem
      borderWidth="1px"
      p={2}
      rounded="xl"
      borderColor={borderColor}
      mb={2}
    >
      <AccordionButton
        w="full"
        justifyContent="space-between"
        px={0}
        _hover={{
          bg: "none",
        }}
      >
        <HStack>
          <Heading fontSize="lg">{title}</Heading>
          {getCount() && (
            <Tag size="sm" rounded={100} colorScheme="gray">
              {getCount()}
            </Tag>
          )}
        </HStack>
        <HStack>
          {showClearBtn && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClear();
              }}
              variant="link"
              fontWeight="normal"
            >
              Clear
            </Button>
          )}
          <AccordionIcon />
        </HStack>
      </AccordionButton>
      <AccordionPanel w="full" pb={2} px={2} maxH={200} overflow="auto">
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};

type PropertyProps = {
  attrMap: AttributeMap;
  onChange?: (attr: GetNftAttributes) => void;
  defaultAttr?: GetNftAttributes;
};

const PropertyString = ({ attrMap, onChange, defaultAttr }: PropertyProps) => {
  const [values, setValues] = useState<any[]>(
    defaultAttr?.value ? defaultAttr.value : []
  );
  return (
    <CustomAccordionItem
      count={values?.length}
      showClearBtn={values && values.length > 0}
      onClear={() => {
        setValues([]);
        onChange &&
          onChange({
            key: attrMap.key,
            type: attrMap.type,
            value: undefined,
          });
      }}
      title={attrMap.label}
    >
      <CheckboxGroup
        onChange={(e) => {
          setValues(e);
          onChange &&
            onChange({
              key: attrMap.key,
              type: attrMap.type,
              value: e as string[],
            });
        }}
        colorScheme="primary"
        value={values}
      >
        <VStack w="full" alignItems="start">
          {attrMap.options?.sort().map((option) => {
            return (
              <Checkbox key={option} value={option}>
                {option}
              </Checkbox>
            );
          })}
        </VStack>
      </CheckboxGroup>
    </CustomAccordionItem>
  );
};
const PropertyBoolean = ({ attrMap, onChange, defaultAttr }: PropertyProps) => {
  const [value, setValue] = useState<string>(
    defaultAttr?.value ? defaultAttr.value[0] : ""
  );
  return (
    <CustomAccordionItem
      count={value ? 1 : 0}
      title={attrMap.label}
      showClearBtn={!!value}
      onClear={() => {
        setValue("");
        onChange &&
          onChange({
            key: attrMap.key,
            type: attrMap.type,
            value: undefined,
          });
      }}
    >
      <RadioGroup
        onChange={(v) => {
          setValue(v);
          onChange &&
            onChange({
              key: attrMap.key,
              type: attrMap.type,
              value: [v],
            });
        }}
        colorScheme="primary"
        value={value}
      >
        <HStack spacing={3}>
          <Radio value={""}>All</Radio>
          <Radio value={"true"}>True</Radio>
          <Radio value={"false"}>False</Radio>
        </HStack>
      </RadioGroup>
    </CustomAccordionItem>
  );
};
const PropertyNumber = ({ attrMap, onChange, defaultAttr }: PropertyProps) => {
  const [min, setMin] = useState<string>(
    defaultAttr?.minNumber ? String(defaultAttr?.minNumber) : ""
  );
  const [max, setMax] = useState<string>(
    defaultAttr?.maxNumber ? String(defaultAttr?.maxNumber) : ""
  );
  const [applied, setApplied] = useState(defaultAttr ? true : false);
  return (
    <CustomAccordionItem
      count={() => {
        if (!applied) return 0;
        return 1;
      }}
      title={attrMap.label}
      showClearBtn={applied}
      onClear={() => {
        setMin("");
        setMax("");
        onChange &&
          onChange({
            key: attrMap.key,
            type: attrMap.type,
            minNumber: undefined,
            maxNumber: undefined,
          });
        setApplied(false);
      }}
    >
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
        <Button
          onClick={() => {
            onChange &&
              onChange({
                key: attrMap.key,
                type: attrMap.type,
                minNumber: min ? Number(min) : undefined,
                maxNumber: max ? Number(max) : undefined,
              });
            setApplied(true);
          }}
          w="full"
        >
          Apply
        </Button>
      </VStack>
    </CustomAccordionItem>
  );
};

export default function Properties({ c }: { c: NftCollectionDto }) {
  const [search, setSearch] = useState<string>();
  const { query, setQuery } = useNftQueryParam();
  const filterOnChange = (attr: GetNftAttributes) => {
    const newAttrs = Array.from(query.attributes).filter(
      (old: GetNftAttributes) => old.key !== attr.key
    );
    newAttrs.push(attr);
    setQuery({ ...query, attributes: newAttrs });
  };
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
            {c.attributesMap.map((attr) => {
              const defaultAttr =
                (query.attributes &&
                  query.attributes.find((a) => a.key === c.key)) ??
                undefined;
              return (
                <Box
                  display={
                    !search ||
                    attr.key.toLowerCase().includes(search.toLowerCase()) ||
                    attr.options?.find((option: string) =>
                      option.toLowerCase().includes(search.toLowerCase())
                    )
                      ? "block"
                      : "none"
                  }
                  key={`${c.id}-${attr.key}`}
                >
                  {attr.type === AttributesMapType.String && (
                    <PropertyString
                      defaultAttr={defaultAttr}
                      onChange={filterOnChange}
                      attrMap={attr}
                    />
                  )}
                  {attr.type === AttributesMapType.Number && (
                    <PropertyNumber
                      defaultAttr={defaultAttr}
                      onChange={filterOnChange}
                      attrMap={attr}
                    />
                  )}
                  {attr.type === AttributesMapType.Boolean && (
                    <PropertyBoolean
                      defaultAttr={defaultAttr}
                      onChange={filterOnChange}
                      attrMap={attr}
                    />
                  )}
                </Box>
              );
            })}
          </Accordion>
        </VStack>
      </VStack>
    )
  );
}
