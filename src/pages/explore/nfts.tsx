import Nfts from "../../components/market/Nfts";
import TabPage, { EXPLORE_LINKS } from "../../layouts/ExplorePage";

export default function Market() {
  return (
    <TabPage links={EXPLORE_LINKS}>
      <Nfts />
    </TabPage>
  );
}
