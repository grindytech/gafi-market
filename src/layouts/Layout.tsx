import { Box, Container, HStack, StackProps, VStack } from "@chakra-ui/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Layout({ children, ...rest }: StackProps) {
  return (
    <VStack
      {...rest}
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
        <Navbar />
        <Container maxW="container.xl" w="full">
          <HStack w="full" alignItems="start">
            <Box overflow="hidden" w="full">
              {children}
            </Box>
            {/* <Box
              h="90vh"
              top={0}
              left={0}
              w="350px"
              position={{
                base: "relative",
                md: "sticky",
              }}
            >
              <Cart />
            </Box> */}
          </HStack>
        </Container>
        <Footer />
      </VStack>
    </VStack>
  );
}
