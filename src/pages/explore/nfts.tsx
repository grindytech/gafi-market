import Nfts from "../../components/market/Nfts";
import TabPage, { EXPLORE_LINKS } from "../../layouts/ExplorePage";
import { MarketType } from "../../services/types/enum";

export default function Market() {
  return (
    <TabPage links={EXPLORE_LINKS}>
      <Nfts enableFilter={true} />
    </TabPage>
  );
}
