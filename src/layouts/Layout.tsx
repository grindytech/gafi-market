import { Box, Container, StackProps, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import useCustomColors from "../theme/useCustomColors";

export default function Layout({ children, ...rest }: StackProps) {
  const { bgColor, textColor } = useCustomColors();
  const router = useRouter();
  const containerRef = useRef(null);
  useEffect(() => {
    const handleRouteChange = () => {
      containerRef?.current?.scrollTo(0, 0);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
  return (
    <VStack
      {...rest}
      position="relative"
      bg={bgColor}
      color={textColor}
      transition="all 0.15s ease-out"
      ref={containerRef}
    >
      <VStack w="full" spacing={5} justifyContent="space-between">
        <Box w="full" h={"60px"} position="sticky" top={0} zIndex={99}>
          <Navbar />
        </Box>
        <Container minH="calc( 100vh - 60px )" maxW="container.xl" w="full">
          {children}
        </Container>
        <Footer />
      </VStack>
    </VStack>
  );
}
