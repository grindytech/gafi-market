import { Box, VStack } from "@chakra-ui/react";
import HomeSlide from "../components/home/HomeSlide";
import HotCollections from "../components/home/HotCollections";
import NftExplore from "../components/home/NftExplore";
import Top from "../components/home/Top";
import { useConnectWallet } from "../connectWallet/useWallet";

const Index = () => {
  const { account } = useConnectWallet();
  return (
    <VStack w="full" spacing={10}>
      <Box w="full" rounded="xl" overflow="hidden">
        <HomeSlide />
      </Box>
      <HotCollections />
      <Top />
      <NftExplore />
    </VStack>
  );
};

export default Index;
