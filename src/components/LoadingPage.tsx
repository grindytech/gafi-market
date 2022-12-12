import { HStack, Spinner } from "@chakra-ui/react";

export default function LoadingPage() {
  return (
    <HStack py={3} w="full" justifyContent="center">
      <Spinner thickness="4px" speed="0.65s" size="lg" />
    </HStack>
  );
}
