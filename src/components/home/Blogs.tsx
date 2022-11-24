import {
  VStack,
  HStack,
  Heading,
  Button,
  Box,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import ScrollSlide from "../hScroll/ScrollSlide";
import NextLink from "next/link";

import { ImageWithFallback } from "../LazyImage";
import useCustomColors from "../../theme/useCustomColors";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
const IMAGE =
  "https://liquidifty.imgix.net/QmXSgpjF9SdNz3Rjqs6cTKfGaRRE3iupF6W3iYp9CpCCNW?auto=compress,format";

export default function Blogs() {
  const { borderColor } = useCustomColors();

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
              <>Blogs&nbsp;</>
            </HStack>
            <Button
              className="right-arrow-btn"
              size="sm"
              rightIcon={<FiArrowRight className="right-arrow-icon" />}
              textTransform="uppercase"
              as={NextLink}
              href="/games"
            >
              View all
            </Button>
          </HStack>
        </Heading>
      </HStack>
      <Box w="full" position="relative">
        <ScrollSlide>
          {Array.from(Array(12).keys()).map((k) => (
            <NextLink href="#" key={`Blogs-${k + 1}`}>
              <Box pb={5} mr={4}>
                <Card
                  _hover={{
                    boxShadow: "md",
                    borderColor: "primary.300",
                  }}
                  p={0}
                  rounded="xl"
                  boxShadow="sm"
                  border="3px solid"
                  borderColor={borderColor}
                >
                  <CardBody p={0} m={0}>
                    <VStack w="full" p={3}>
                      <Box
                        pos={"relative"}
                        overflow="hidden"
                        bg={useColorModeValue("gray.600", "gray.800")}
                        rounded="xl"
                        w={400}
                        h={300}
                        maxW="full"
                        border={"1px solid"}
                        borderColor={useColorModeValue("gray.200", "gray.700")}
                      >
                        <ImageWithFallback
                          // data-component-name="NFTImage"
                          h="full"
                          w="full"
                          src={IMAGE}
                          objectFit="cover"
                        />
                      </Box>
                      <VStack w="full" alignItems="start">
                        <Text fontSize="lg" fontWeight="semibold">
                          BEAR MARKET: WHY DID IT HAPPEN?
                        </Text>
                        <Text fontSize="md">
                          Usually, a bear market causes doubts even among
                          full-fledged investors and traders, not to mention
                          beginners. Hopefully, our tips may assist you in
                          staying optimistic, preserving, and even increasing
                          your assets.
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </Box>
            </NextLink>
          ))}
        </ScrollSlide>
      </Box>
    </VStack>
  );
}
