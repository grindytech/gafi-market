import { SearchIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton as ChakraAccordionButton,
  AccordionButtonProps,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import Icons from "../../images";
import NftCollectionsList from "./NftCollectionsList";
import SearchBox from "../SearchBox";
import PriceFilter from "./PriceFilter";
import RadioCardGroup from "./RadioCardGroup";
import { MarketType } from "../../services/types/enum";
import { Attribute } from "../../services/types/dtos/Attribute";
const AccordionButton = ({ children, ...rest }: AccordionButtonProps) => {
  return (
    <ChakraAccordionButton
      w="full"
      justifyContent="space-between"
      px={0}
      _hover={{
        bg: "none",
      }}
      {...rest}
    >
      {children}
    </ChakraAccordionButton>
  );
};

const BLOCK_OPTIONS = [
  {
    label: "All chain",
    value: "all",
    icon: <></>,
    defaultChecked: true,
  },
  {
    label: "BSC",
    value: "bsc",
    icon: (
      <Icon w={5} h={5}>
        <Icons.chain.BSC />
      </Icon>
    ),
  },
  {
    label: "AVAX",
    value: "avax",
    icon: (
      <Icon w={5} h={5}>
        <Icons.chain.AVAX />
      </Icon>
    ),
  },
  {
    label: "DOS",
    value: "dos",
    icon: (
      <Icon w={5} h={5}>
        <Icons.chain.DOS />
      </Icon>
    ),
  },
];
const STATUS_OPTIONS = [
  {
    label: "All",
    value: "all",
    icon: <></>,
  },
  {
    label: "On sale",
    value: "OnSale",
    icon: <></>,
  },
  {
    label: "Not for sale",
    value: "NotForSale",
    icon: <></>,
  },
];

export default function NftsFilter() {
  const [chain, setChain] = useState("all");
  const [collection, setCollection] = useState<string>();
  const [search, setSearch] = useState<string>();
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const [status, setStatus] = useState<MarketType>();
  const [paymentToken, setPaymentToken] = useState<string>();
  const [attributes, setAttributes] = useState<Attribute[]>();

  return (
    <VStack w="full" h="full" p={5} overflow="auto">
      <HStack w="full" mb={1} justifyContent="space-between">
        <SearchBox
          placeHolder="Search..."
          value={search}
          onChange={(v) => {
            setSearch(v);
          }}
        />
      </HStack>
      <Accordion w="full" defaultIndex={[0, 1, 2, 3]} allowMultiple>
        <AccordionItem borderTop="none">
          <AccordionButton>
            <Heading fontSize="lg">Blockchain</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px={0}>
            <RadioCardGroup
              onChange={(v: any) => {
                setChain(v);
              }}
              direction="row"
              flexWrap="wrap"
              defaultValue="all"
              defaultChecked={true}
              spacing={0}
              options={BLOCK_OPTIONS}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton py={4}>
            <Heading fontSize="lg">Price</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px={0}>
            <PriceFilter />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton py={4}>
            <Heading fontSize="lg">Status</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px={0}>
            <RadioCardGroup
              onChange={(v: any) => {}}
              direction="row"
              flexWrap="wrap"
              defaultValue="all"
              defaultChecked={true}
              spacing={0}
              options={STATUS_OPTIONS}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem borderBottom="none">
          <AccordionButton py={4}>
            <Heading fontSize="lg">Collection</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel overflow="auto" pb={4} p={0}>
            <NftCollectionsList />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}
