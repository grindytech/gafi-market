import { Box, Heading, HStack, VStack } from "@chakra-ui/react";
import ScrollSlide from "../hScroll/ScrollSlide";
import NftCard from "../NftCard";
const IMAGE =
  "https://i.seadn.io/gae/-u2Nd8nL-zLYfiCLZoXdVq-8KTtRObWGx7TNKsUftIytEnxwt1sYDbUCImXQWPIKxjKyszs96d5HEYQykXzzDRxbOVtb8GpO0_Gb?auto=format&w=1920";

export default function RecentlySold() {
  return (
    <VStack w="full">
      <HStack
        mb={3}
        w="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading w="full" fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
          <HStack justifyContent="space-between" w="full">
            <HStack alignItems="center">
              <>Recently Sold&nbsp;</>
            </HStack>
          </HStack>
        </Heading>
      </HStack>
      <Box w="full" position="relative">
        <ScrollSlide>
          {Array.from(Array(12).keys()).map((k) => (
            <Box w={300} pr={3} pb={5}>
              <NftCard image={IMAGE} />
            </Box>
          ))}
        </ScrollSlide>
      </Box>
    </VStack>
  );
}
