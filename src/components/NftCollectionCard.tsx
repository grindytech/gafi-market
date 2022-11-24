import {
  Avatar,
  Box,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { HiBadgeCheck } from "react-icons/hi";
import useCustomColors from "../theme/useCustomColors";
import Card from "./card/Card";
import CardBody from "./card/CardBody";
import { ImageWithFallback } from "./LazyImage";
const IMAGE = "https://heroesempires.com/ogimge.jpg";

export default function NftCollectionCard({ top }: { top: number }) {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");
  const { borderColor } = useCustomColors();
  return (
    <Box pr={3} pb={5} w="fit-content">
      <Card
        p={3}
        __css={cardStyles}
        border="1px solid"
        borderColor={borderColor}
      >
        <CardBody>
          <VStack>
            <Box
              pos={"relative"}
              height={350}
              overflow="hidden"
              bg={useColorModeValue("gray.600", "gray.800")}
              rounded="xl"
              w={400}
              maxW="full"
            >
              <ImageWithFallback
                data-component-name="NFTImage"
                __css={imageStyles}
                h="full"
                w="full"
                src={IMAGE}
              />
            </Box>
            <HStack justifyContent="space-between" position="relative" w="full">
              <HStack justifyContent="start">
                <Avatar
                  src={IMAGE}
                  borderColor="primary.200"
                  borderWidth={1}
                />
                <HStack justifyContent="start" spacing={0} alignItems="center">
                  <VStack alignItems="start" spacing={0}>
                    <HStack spacing={1}>
                      <Heading fontSize={{ base: "lg", md: "2lg", lg: "3lg" }}>
                        Heroes&nbsp;
                      </Heading>
                      <Icon color="primary.500" h={5} w={5}>
                        <HiBadgeCheck size="25px" />
                      </Icon>
                    </HStack>
                    <HStack
                      fontWeight="500"
                      color="gray.400"
                      fontSize="sm"
                    >
                      <Text>Vol:</Text>
                      <Text>$300m</Text>
                      <Text>Floor:</Text>
                      <Text>100HE</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </HStack>
              <Box px={3}>
                <Text fontWeight="bold" fontSize="5xl" color="gray.300">
                  {top}
                </Text>
              </Box>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
