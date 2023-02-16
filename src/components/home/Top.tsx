import {
  Box,
  Heading,
  Link,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import TopCard from "../TopCard";

const TopCards = () => {
  return (
    <SimpleGrid columns={[1, 2, 3]} gap="20px">
      {Array.from(Array(12).keys()).map((k) => (
        <Link key={`TopCard-${k + 1}`}>
          <TopCard top={k + 1} />
        </Link>
      ))}
    </SimpleGrid>
  );
};

const CustomTab = (props: any) => {
  return (
    <Tab
      _selected={{ color: useColorModeValue("black", "white") }}
      color="gray.500"
    >
      <Heading fontSize={{ base: "lg", md: "3xl" }} textTransform="uppercase">
        {props.children}
      </Heading>
    </Tab>
  );
};
export default function Top() {
  return (
    <Box boxShadow='sm' w="full" bg={useColorModeValue("white", "black")} rounded="xl" p={5}>
      <Tabs variant="unstyled">
        <TabList>
          <CustomTab>TOP SELLERS</CustomTab>
          <CustomTab>TOP CREATORs</CustomTab>
          <CustomTab>TOP BUYERs</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TopCards />
          </TabPanel>
          <TabPanel>
            <TopCards />
          </TabPanel>
          <TabPanel>
            <TopCards />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
