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
  Card,
  CardBody,
  CardHeader,
  CloseButton,
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
import { selectProfile } from "../../store/profileSlice";
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

export default function NftsFilter() {
  const { query, setQuery } = useNftQueryParam();
  const { chains } = useSelector(selectSystem);

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
              value={query.chain}
              onChange={(v: any) => {
                setQuery({ ...query, chain: v });
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
              value={query.marketType}
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

export function NftsFilterMobileBtn({ children, ...rest }: ButtonProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { reset } = useNftQueryParam();
  return (
    <Box>
      <Button {...rest} onClick={onOpen}>
        {children}
      </Button>
      <VStack
        display={isOpen ? "block" : "none"}
        position="fixed"
        zIndex={100}
        w="100vw"
        h="full"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={useColorModeValue("gray.50", "gray.900")}
      >
        <HStack
          h="60px"
          alignItems="center"
          boxShadow="md"
          px={5}
          w="full"
          justifyContent="space-between"
        >
          <Heading fontSize="xl">FILTER</Heading>
          <CloseButton onClick={onClose} />
        </HStack>
        <Box w="full" h="calc( 100vh - 60px )" overflow="auto">
          <Box mb="100px">
            <NftsFilter />
          </Box>
        </Box>
        <HStack
          p={3}
          w="full"
          justifyContent="center"
          alignItems="center"
          bg={useColorModeValue("rgba(255,255,255,0.9)", "gray.900")}
          position="absolute"
          bottom={0}
          left={0}
          height="100px"
          spacing={5}
        >
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
      </VStack>
    </Box>
  );
}
