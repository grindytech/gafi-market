import { Box } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Bundles from "../../components/bundle/Bundles";
import TabPage, { MARKET_LINKS } from "../../layouts/ExplorePage";

export default function MarketBundlePage() {
  return (
    <TabPage links={MARKET_LINKS}>
      <Box w="full" id="main">
        <NextSeo
          title={`Bundles Market | Overmint Marketplace`}
          description={`Bundles Market | Overmint Marketplace`}
        />
        <Bundles />
      </Box>
    </TabPage>
  );
}
