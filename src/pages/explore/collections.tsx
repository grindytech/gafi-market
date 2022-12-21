import { Box } from "@chakra-ui/react";
import Collections from "../../components/collections/Collections";
import TabPage, { EXPLORE_LINKS } from "../../layouts/ExplorePage";

export default function Market() {
  return (
    <TabPage links={EXPLORE_LINKS}>
      <Box w="full" id="main">
        <Collections />
      </Box>
    </TabPage>
  );
}
