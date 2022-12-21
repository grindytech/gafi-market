import { Box, VStack } from "@chakra-ui/react";
import Blogs from "../components/home/Blogs";
import FeaturedGames from "../components/home/FeaturedGames";
import HomeSlide from "../components/home/HomeSlide";
import HotCollections from "../components/home/HotCollections";
import NftExplore from "../components/home/NftExplore";
import RecentlySold from "../components/home/RecentlySold";
import { useConnectWallet } from "../connectWallet/useWallet";

const Index = () => {
  return (
    <VStack id="main" w="full" spacing={12} mb={5}>
      <Box w="full" rounded="xl" overflow="hidden">
        <HomeSlide />
      </Box>
      <HotCollections />
      <FeaturedGames />
      <RecentlySold />
      <NftExplore />
      <Blogs />
    </VStack>
  );
};

export default Index;
