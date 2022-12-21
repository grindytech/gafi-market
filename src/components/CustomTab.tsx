import {
  Tab,
  useColorModeValue,
  Heading,
  HeadingProps,
} from "@chakra-ui/react";

const CustomTab = ({ children, ...rest }: HeadingProps) => {
  return (
    <Tab
      {...rest}
      _selected={{ color: useColorModeValue("black", "white") }}
      color="gray.500"
      overflow="visible"
    >
      <Heading
        whiteSpace="nowrap"
        noOfLines={1}
        fontSize={{ base: "lg", md: "xl" }}
      >
        {children}
      </Heading>
    </Tab>
  );
};
export default CustomTab;
