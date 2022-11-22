import {
  Button,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import NftCard from "../NftCard";

export default function NftExplore() {
  return (
    <VStack mb={3} w="full" alignItems="start">
      <HStack w="full" justifyContent="space-between">
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
      <SimpleGrid w="full" columns={[1, 2, 3, 4]} spacing="15px">
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
      </SimpleGrid>
    </VStack>
  );
}
