import {
  Avatar,
  Box,
  Heading,
  HStack,
  Icon,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { HiBadgeCheck } from "react-icons/hi";
import Card from "./card/Card";
import CardBody from "./card/CardBody";
import { ImageWithFallback } from "./LazyImage";
const IMAGE =
  "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80";

export default function NftCollectionCard() {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");

  return (
    <Box p={1} pb={3} w="fit-content">
      <Card p={0} __css={cardStyles}>
        <CardBody>
          <VStack>
            <Box
              w="fit-content"
              pos={"relative"}
              height={"230px"}
              overflow="hidden"
              width="full"
              bg={useColorModeValue("gray.600", "gray.800")}
            >
              <ImageWithFallback
                data-component-name="NFTImage"
                __css={imageStyles}
                h={230}
                w={[200, 295, 260, 250, 295]}
                src={"/"}
              />
            </Box>
            <HStack position="relative" w="full" pb={5}>
              <Avatar src={IMAGE} position="absolute" top="-20px" left="10px" />
              <HStack spacing={0} alignItems="center">
                <Heading
                  pl="60px"
                  fontSize={{ base: "lg", md: "2lg", lg: "3lg" }}
                >
                  Heroes&nbsp;
                </Heading>
                <Icon color="blue.500" h={5} w={5}>
                  <HiBadgeCheck size="25px" />
                </Icon>
              </HStack>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
