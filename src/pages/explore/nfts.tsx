import { Box } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Nfts from "../../components/market/Nfts";
import TabPage, { EXPLORE_LINKS } from "../../layouts/ExplorePage";

export default function Market() {
  return (
    <TabPage links={EXPLORE_LINKS}>
      <Box w="full" id="main">
        <NextSeo
          title={`NFTs | Overmint Marketplace`}
          description={`NFTs | Overmint Marketplace`}
        />
        <Nfts enableFilter={true} />
      </Box>
    </TabPage>
  );
}
