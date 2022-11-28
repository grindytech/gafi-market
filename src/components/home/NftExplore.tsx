import {
  Box,
  Button,
  Fade,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import NftCard from "../nftcard/NftCard";
import PrimaryButton from "../PrimaryButton";
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
      <SimpleGrid w="full" columns={[1, 2, 4, 4, 5]} spacing="15px">
        {Array.from(Array(12).keys()).map((k) => (
          <NftCard 
            key={`nft-${k}`}
            image={IMAGE}
            showOnHover={
              <VStack
                w="full"
                h="full"
                justifyContent="space-between"
                alignItems="start"
                zIndex={3}
              >
                <Box></Box>
                <HStack w="full" justifyContent="center" p={2}>
                  <Fade in={true}>
                    {k % 3 === 0 ? (
                      <>
                        {k % 2 === 0 && (
                          <HStack>
                            <PrimaryButton>Buy now</PrimaryButton>
                            <IconButton aria-label="Add to cart">
                              <FiPlus size="30px" />
                            </IconButton>
                          </HStack>
                        )}
                        {k % 2 !== 0 && (
                          <HStack>
                            <PrimaryButton>Make offer</PrimaryButton>
                          </HStack>
                        )}
                      </>
                    ) : (
                      <>
                        <HStack>
                          <PrimaryButton
                            colorScheme="red"
                            bg="red.600"
                            _hover={{ bg: "red.500" }}
                          >
                            Cancel
                          </PrimaryButton>
                        </HStack>
                      </>
                    )}
                  </Fade>
                </HStack>
              </VStack>
            }
          >
            <VStack w="full" alignItems="start" p={3} spacing={2}>
              <VStack p={1} w="full" alignItems="start" spacing={0}>
                <NextLink href="#">
                  <Text
                    _hover={{
                      textDecoration: "underline",
                    }}
                    color="primary.50"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    HE Heroes{" "}
                    <Icon color="primary.50" h={4} w={4}>
                      <HiBadgeCheck size="25px" />
                    </Icon>
                  </Text>
                </NextLink>
                <Text fontSize="md" fontWeight="semibold">
                  Theta
                </Text>
              </VStack>
              <HStack
                p={3}
                bg="rgba(100,100,100,0.1)"
                w="full"
                justifyContent="space-between"
                rounded="xl"
              >
                <VStack w="50%" alignItems="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="semibold">
                    Price
                  </Text>
                  <Text color="gray.400">
                    {k % 2 === 0 ? "0.3 BNB" : "Not for sale"}
                  </Text>
                </VStack>
                <VStack w="50%" alignItems="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="semibold">
                    Last sold
                  </Text>
                  <Text color="gray.400">
                    {k % 2 === 0 ? "0.25 BNB" : "--"}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </NftCard>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
