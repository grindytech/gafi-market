import {
  Accordion,
  AccordionButton as ChakraAccordionButton,
  AccordionButtonProps,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonProps,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Icon,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useSelector } from "react-redux";
import Icons from "../../images";
import { ChainDto } from "../../services/types/dtos/ChainDto";
import { selectSystem } from "../../store/systemSlice";
import PrimaryButton from "../PrimaryButton";
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

type Option =
  | "search"
  | "chain"
  | "price"
  | "attribute"
  | "marketStatus"
  | "collection";
export const NFTS_FILTER_OPTIONS: Option[] = [
  "search",
  "chain",
  "price",
  "attribute",
  "marketStatus",
  "collection",
];
export const COLLECTIONS_FILTER_OPTIONS: Option[] = ["search", "chain"];

export default function NftsFilter({
  options,
  collectionProps,
}: {
  options: Option[];
  collectionProps?: {
    nftCollection?: string;
    disableChange?: boolean;
  };
}) {
  const { query, setQuery } = useNftQueryParam();
  const { chains } = useSelector(selectSystem);

  return (
    <VStack p={3} w="full" h="full" overflow="auto">
      <HStack w="full" mb={1} justifyContent="space-between">
        <SearchBox
          placeHolder="Search..."
          value={query.search}
          onChange={(v) => {
            setQuery({ search: v });
          }}
        />
      </HStack>
      <Accordion w="full" defaultIndex={[0, 1, 2, 3]} allowMultiple>
        {options.includes("search") && (
          <AccordionItem borderTop="none">
            <AccordionButton>
              <Heading fontSize="lg">Blockchain</Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <RadioCardGroup
                value={query.chain}
                onChange={(v: any) => {
                  setQuery({ chain: v });
                }}
                direction="row"
                flexWrap="wrap"
                spacing={0}
                options={[
                  {
                    label: "All chain",
                    value: "",
                    icon: <></>,
                  },
                  ,
                  ...chains.map((chain: ChainDto) => {
                    const icon = Icons.chain[chain.symbol.toUpperCase()];
                    return {
                      label: chain.name,
                      value: chain.id,
                      icon: icon ? (
                        <Icon w={5} h={5}>
                          {icon()}
                        </Icon>
                      ) : (
                        <Jazzicon
                          diameter={20}
                          seed={jsNumberForAddress(String(chain.symbol))}
                        />
                      ),
                    };
                  }),
                ]}
              />
            </AccordionPanel>
          </AccordionItem>
        )}
        {options.includes("price") && (
          <AccordionItem>
            <AccordionButton py={4}>
              <Heading fontSize="lg">Price</Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <PriceFilter />
            </AccordionPanel>
          </AccordionItem>
        )}
        {options.includes("marketStatus") && (
          <AccordionItem>
            <AccordionButton py={4}>
              <Heading fontSize="lg">Status</Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <RadioCardGroup
                value={query.marketType}
                onChange={(v: any) => {
                  setQuery({
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
        )}
        {options.includes("collection") && (
          <AccordionItem borderBottom="none">
            <AccordionButton py={4}>
              <Heading fontSize="lg">Collection</Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel overflow="auto" pb={4} p={0}>
              <NftCollectionsList
                disableChange={collectionProps?.disableChange}
                nftCollection={collectionProps?.nftCollection}
              />
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </VStack>
  );
}

export function NftsFilterMobileBtn({
  options,
  children,
  collectionProps,
  ...rest
}: {
  options: Option[];
  collectionProps?: {
    nftCollection?: string;
    disableChange?: boolean;
  };
} & ButtonProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { reset } = useNftQueryParam();
  const btnRef = React.useRef();
  return (
    <Box>
      <Button ref={btnRef} {...rest} onClick={onOpen}>
        {children}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent bg={useColorModeValue("gray.50", "gray.900")}>
          <DrawerCloseButton />
          <DrawerHeader>FILTER</DrawerHeader>

          <DrawerBody>
            <Box>
              <NftsFilter collectionProps={collectionProps} options={options} />
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <HStack w="full" justifyContent="center">
              <Button
                rounded="full"
                size="lg"
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                Reset all
              </Button>
              <PrimaryButton size="lg" rounded="full" onClick={onClose}>
                View result
              </PrimaryButton>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
