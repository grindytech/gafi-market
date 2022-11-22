import {
  Box,
  Heading,
  HStack,
  Image,
  Text,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import Card from "./card/Card";
import CardBody from "./card/CardBody";
import LazyImage from "./LazyImage";
const IMAGE = "https://d343muqqn13tb8.cloudfront.net/heroes/Ares.png";

export default function NftCard() {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");

  return (
    <Box w="full" p={1} pb={3}>
      <Card p={0} __css={cardStyles}>
        <CardBody>
          <VStack w="full">
            <Box
              bg={useColorModeValue("gray.600", "gray.800")}
              pos={"relative"}
              w="full"
              height={"300px"}
              overflow="hidden"
            >
              <LazyImage
                data-component-name="NFTImage"
                __css={imageStyles}
                h={300}
                w="full"
                src={IMAGE}
              />
            </Box>
            <VStack p={3} w="full" spacing={1} alignItems="start">
              <Heading fontSize={{ base: "md", md: "2md", lg: "3md" }}>
                Ares #12121
              </Heading>
              <Heading fontSize={{ base: "lg", md: "2lg", lg: "3lg" }}>
                0.3 BNB
              </Heading>
              <Text fontSize="sm" colorScheme="gray">
                Last sale: 0.22 BNB
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
