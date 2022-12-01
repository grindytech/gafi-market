import { Container, StackProps, VStack } from "@chakra-ui/react";
import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Layout({ children, ...rest }: StackProps) {
  return (
    <VStack
      {...rest}
      w="full"
      position="relative"
      bg="white"
      color="black"
      _dark={{
        bg: "gray.900",
        color: "gray.100",
      }}
      transition="all 0.15s ease-out"
    >
      <VStack w="full" spacing={5} minH="100vh" justifyContent="space-between">
        <VStack w="full" spacing={5}>
          <Navbar />
          <Container maxW="container.xl" w="full">
            {children}
          </Container>
        </VStack>
        <Footer />
      </VStack>
    </VStack>
  );
}
