import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Link,
  SimpleGrid,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import nftService from "../../services/nft.service";
import { UserDto } from "../../services/types/dtos/UserDto";
import { Roles } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import useCustomColors from "../../theme/useCustomColors";
import { numeralFormat, shorten } from "../../utils/utils";
import CustomTab from "../CustomTab";
import Nfts from "../market/Nfts";
import UserActivities from "../profile/Activities";
import ProfileHeader from "../profile/ProfileHeader";
import NextLink from "next/link";
import { useGetCollectionStatistic } from "../../hooks/useGetSystemInfo";
import { useMemo } from "react";
import numeral from "numeral";

export default function Collection({ id }: { id: string }) {
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "nfts"));
  const { profile, isLoggedIn } = useSelector(selectProfile);
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

  const { collectionStatistic } = useGetCollectionStatistic({
    collectionId: collection?.id,
  });
  const stats = useMemo(
    () =>
      collectionStatistic
        ? [
            {
              label: "items",
              value: numeral(Number(collectionStatistic?.totalItems)).format(
                "0,0.[00]a"
              ),
            },
            {
              label: "owner",
              value: numeral(Number(collectionStatistic?.totalOwners)).format(
                "0,0.[00]a"
              ),
            },
            {
              label: "floor price",
              value:
                "$" + numeralFormat(Number(collectionStatistic?.floorPrice)),
            },
            {
              label: "total volume",
              value: "$" + numeralFormat(Number(collectionStatistic?.totalVol)),
            },
            {
              label: "24h volume",
              value: "$" + numeralFormat(Number(collectionStatistic?.vol24h)),
            },
          ]
        : [],
    [collectionStatistic]
  );
  return (
    collection && (
      <VStack id="main" w="full" alignItems="start" spacing={5}>
        <ProfileHeader
          address={collection.nftContract}
          name={collection.name}
          avatar={collection.avatar}
          cover={collection.cover}
          // socials={collection.socials}
          description={collection.description}
          username={collection.key}
        >
          {isLoggedIn && profile.roles?.includes(Roles.superAdmin) && (
            <NextLink href={`/collection/edit/${collection.key}`}>
              <IconButton
                aria-label="edit"
                position="absolute"
                top={3}
                right={3}
              >
                <EditIcon />
              </IconButton>
            </NextLink>
          )}
          <HStack w="full" justifyContent={["start", "end"]}>
            <Box pt={3}>
              <SimpleGrid columns={[3, 3, 5]} rounded="lg" bg={borderColor}>
                {stats.map((stat, index) => (
                  <VStack minW={120} p={3} spacing={0}>
                    <Text fontSize="xl" fontWeight="semibold">
                      {stat.value}
                    </Text>
                    <Text color="gray" fontSize="sm" fontWeight="semibold">
                      {stat.label}
                    </Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </Box>
          </HStack>
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
