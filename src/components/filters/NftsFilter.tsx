import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton as ChakraAccordionButton,
  AccordionButtonProps,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import Icons from "../../images";

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

export default function NftsFilter() {
  return (
    <VStack w="full" p={5}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          variant="filled"
          placeholder="Search nfts"
          _focusVisible={{
            borderColor: "primary.300",
          }}
        />
      </InputGroup>
      <Accordion w="full" defaultIndex={[3]} allowMultiple>
        <AccordionItem borderTop="none">
          <AccordionButton>
            <Heading fontSize="lg">Network</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}></AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Heading fontSize="lg">Price</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}></AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton>
            <Heading fontSize="lg">Status</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}></AccordionPanel>
        </AccordionItem>

        <AccordionItem borderBottom="none">
          <AccordionButton>
            <Heading fontSize="lg">Collection</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}></AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}
