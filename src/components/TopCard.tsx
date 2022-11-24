import {
  Avatar,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { HiBadgeCheck } from "react-icons/hi";
import Card from "./card/Card";
import CardBody from "./card/CardBody";

export default function TopCard({ top }: { top: number }) {
  return (
    <Card
      bg={useColorModeValue("white", "gray.900")}
      _hover={{
        boxShadow: "lg",
        borderColor: "primary.500",
      }}
      transition="all ease 0.5s"
      rounded="xl"
      border="2px solid"
      borderColor={useColorModeValue("gray.200", "gray.900")}
    >
      <CardBody>
        <HStack alignItems="center" w="full" justifyContent="space-between">
          <HStack spacing={3}>
            <Text fontWeight="bold" fontSize="2xl" color="gray.300">
              {top}
            </Text>
            <Avatar />
            <VStack alignItems="start" spacing={0}>
              <HStack spacing={0} alignItems="center">
                <Text>Heroes & empires&nbsp;</Text>
                <Icon color="primary.500" h={5} w={5}>
                  <HiBadgeCheck size="25px" />
                </Icon>
              </HStack>
              <Text fontSize="sm" colorScheme="gray">
                @heroesAndEmpires
              </Text>
            </VStack>
          </HStack>
          <Text fontWeight="semibold">$ 2.2M</Text>
        </HStack>
      </CardBody>
    </Card>
  );
}
