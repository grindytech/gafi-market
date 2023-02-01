import { Box } from "@chakra-ui/react";
import Bundles from "../../components/bundle/Bundles";
import TabPage, { MARKET_LINKS } from "../../layouts/ExplorePage";

export default function MarketBundlePage() {
  return (
    <TabPage links={MARKET_LINKS}>
      <Box w="full" id="main">
        <Bundles />
      </Box>
    </TabPage>
  );
}
