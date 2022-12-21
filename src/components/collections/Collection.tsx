import { TabList, TabPanel, TabPanels, Tabs, VStack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import nftService from "../../services/nft.service";
import CustomTab from "../CustomTab";
import Nfts from "../market/Nfts";
import UserActivities from "../profile/Activities";
import ProfileHeader from "../profile/ProfileHeader";

export default function Collection({ id }: { id: string }) {
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "nfts"));
  const { data: collection, isLoading } = useQuery(
    ["Collection", id],
    async () => {
      const rs = await nftService.getNftCollection(id);
      return rs.data;
    },
    {
      enabled: !!id,
    }
  );

  const TABS = [
    {
      title: "NFTs",
      panel: () => <Nfts enableFilter={true} nftCollection={collection.id} />,
      key: "nfts",
    },
    {
      title: "Activities",
      panel: () => <UserActivities collection={collection.id} />,
      key: "activities",
    },
  ];
  const tabIndex = tab ? TABS.findIndex((t) => t.key === tab) : 0;
  return (
    collection && (
      <VStack w="full" alignItems="start" spacing={5}>
        <ProfileHeader
          address={collection.nftContract}
          name={collection.name}
          avatar={collection.avatar}
          cover={collection.cover}
          socials={collection.socials}
          description={collection.description}
        />
        <Tabs defaultIndex={tabIndex || 0} variant="enclosed" w="full" pt={5}>
          <TabList p={1} overflow="auto">
            {TABS.map((t, index) => (
              <CustomTab
                onClick={() => {
                  setTab(t.key);
                }}
                pl={index === 0 ? 0 : 3}
                key={`tab-${t.key}`}
              >
                {t.title}
              </CustomTab>
            ))}
          </TabList>
          <TabPanels>
            {TABS.map((t, index) => (
              <TabPanel key={`panel-${t.key}`} px={0}>
                {t.panel()}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </VStack>
    )
  );
}
