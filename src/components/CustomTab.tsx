import {
  Tab,
  useColorModeValue,
  Heading,
  HeadingProps,
} from "@chakra-ui/react";

const CustomTab = ({ children, ...rest }: HeadingProps) => {
  return (
    <Tab
      _selected={{ color: useColorModeValue("black", "white") }}
      color="gray.500"
    >
      <Heading
        fontSize="xl"
        fontWeight="semibold"
        // fontSize={{ base: "lg", md: "3xl" }}
        // textTransform="uppercase"
        {...rest}
      >
        {children}
      </Heading>
    </Tab>
  );
};
export default CustomTab;
