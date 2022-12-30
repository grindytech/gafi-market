import {
  Box,
  Button,
  HStack,
  Link,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import nftService from "../../services/nft.service";
import useCustomColors from "../../theme/useCustomColors";
import { shorten } from "../../utils/utils";
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
  const { borderColor } = useCustomColors();
  const STATS = [
    {
      label: "items",
      value: 100,
    },
    {
      label: "owner",
      value: 100,
    },
    {
      label: "floor price",
      value: "$100",
    },
    {
      label: "total volume",
      value: "$100",
    },
  ];
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
          username={collection.key}
        >
          <Box pt={3}>
            <HStack rounded="lg" bg={borderColor}>
              {STATS.map((stat, index) => (
                <VStack
                  minW={120}
                  p={3}
                  borderLeftWidth={index !== 0 ? 1 : 0}
                  spacing={0}
                >
                  <Text fontSize="xl" fontWeight="semibold">
                    {stat.value}
                  </Text>
                  <Text color="gray" fontSize="sm" fontWeight="semibold">
                    {stat.label}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Box>
        </ProfileHeader>
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
