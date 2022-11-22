import { Container, VStack } from "@chakra-ui/react";
import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Layout(props: any) {
  return (
    <VStack
      w="full"
      position="relative"
      bg="gray.100"
      color="black"
      _dark={{
        bg: "gray.900",
        color: "white",
      }}
      transition="all 0.15s ease-out"
    >
      <VStack w="full" spacing={5} minH="100vh" justifyContent="space-between">
        <VStack w="full" spacing={5}>
          <Navbar />
          <Container maxW="container.xl" w="full">
            {props.children}
          </Container>
        </VStack>
        <Footer />
      </VStack>
    </VStack>
  );
}
