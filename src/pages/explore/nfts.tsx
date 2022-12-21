import { Box } from "@chakra-ui/react";
import Nfts from "../../components/market/Nfts";
import TabPage, { EXPLORE_LINKS } from "../../layouts/ExplorePage";

export default function Market() {
  return (
    <TabPage links={EXPLORE_LINKS}>
      <Box w="full" id="main">
        <Nfts enableFilter={true} />
      </Box>
    </TabPage>
  );
}
