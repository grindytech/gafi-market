import { Box } from "@chakra-ui/react";
import Nfts from "../../components/market/Nfts";
import TabPage, { MARKET_LINKS } from "../../layouts/ExplorePage";
import { MarketType } from "../../services/types/enum";

export default function Market() {
  return (
    <TabPage links={MARKET_LINKS}>
      <Box w="full" id="main">
        <Nfts status={MarketType.OnSale} enableFilter={true} />
      </Box>
    </TabPage>
  );
}
