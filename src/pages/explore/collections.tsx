import { Box } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Collections from "../../components/collections/Collections";
import TabPage, { EXPLORE_LINKS } from "../../layouts/ExplorePage";

export default function Market() {
  return (
    <TabPage links={EXPLORE_LINKS}>
      <Box w="full" id="main">
        <NextSeo
          title={`NFT Collections | Overmint Marketplace`}
          description={`NFT Collections  |Overmint Marketplace`}
        />
        <Collections />
      </Box>
    </TabPage>
  );
}
