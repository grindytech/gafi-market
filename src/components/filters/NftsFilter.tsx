import {
  Accordion,
  AccordionButton as ChakraAccordionButton,
  AccordionButtonProps,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  HStack,
  Icon,
  VStack,
} from "@chakra-ui/react";
import Icons from "../../images";
import SearchBox from "../SearchBox";
import NftCollectionsList from "./NftCollectionsList";
import PriceFilter from "./PriceFilter";
import RadioCardGroup from "./RadioCardGroup";
import { useNftQueryParam } from "./useCustomParam";
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
    value: "",
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
    value: "",
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
  const { query, setQuery } = useNftQueryParam();
  return (
    <VStack w="full" h="full" p={5} overflow="auto">
      <HStack w="full" mb={1} justifyContent="space-between">
        <SearchBox
          placeHolder="Search..."
          value={query.search}
          onChange={(v) => {
            setQuery({ ...query, search: v });
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
                setQuery({ ...query, chain: v });
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
              onChange={(v: any) => {
                setQuery({
                  ...query,
                  marketType: v,
                });
              }}
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
