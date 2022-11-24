import { Button, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { FiArrowRight } from "react-icons/fi";
import NftCard from "../NftCard";
const IMAGE = "https://d343muqqn13tb8.cloudfront.net/heroes/Thera.png";
export default function NftExplore() {
  return (
    <VStack w="full" alignItems="start">
      <HStack w="full" justifyContent="space-between" mb={3}>
        <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
          Explore
        </Heading>
        <Button
          className="right-arrow-btn"
          size="sm"
          rightIcon={<FiArrowRight className="right-arrow-icon" />}
          textTransform="uppercase"
          as={NextLink}
          href="/market"
        >
          View all
        </Button>
      </HStack>
      <SimpleGrid w="full" columns={[1, 2, 4, 4, 6]} spacing="15px">
        {Array.from(Array(12).keys()).map((k) => (
          <NftCard image={IMAGE} />
        ))}
      </SimpleGrid>
    </VStack>
  );
}
