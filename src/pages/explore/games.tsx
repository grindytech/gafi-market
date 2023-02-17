import { Box } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Games from "../../components/game/Games";
import TabPage, { EXPLORE_LINKS } from "../../layouts/ExplorePage";

export default function Market() {
  return (
    <TabPage links={EXPLORE_LINKS}>
      <Box w="full" id="main">
        <NextSeo
          title={`Games | Overmint Marketplace`}
          description={`Games | Overmint Marketplace`}
        />
        <Games />
      </Box>
    </TabPage>
  );
}
