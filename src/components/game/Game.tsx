import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  IconButton,
  Link,
  SimpleGrid,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import nftService from "../../services/nft.service";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import { Roles, Status } from "../../services/types/enum";
import { selectProfile } from "../../store/profileSlice";
import useCustomColors from "../../theme/useCustomColors";
import NftCollectionCard from "../collections/NftCollectionCard";
import CustomTab from "../CustomTab";
import ScrollSlide from "../hScroll/ScrollSlide";
import Nfts from "../market/Nfts";
import ProfileHeader from "../profile/ProfileHeader";

export default function Game({ id }: { id: string }) {
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "nfts"));
  const { profile, isLoggedIn } = useSelector(selectProfile);
  const { data: game, isLoading } = useQuery(
    ["Game", id],
    async () => {
      const rs = await nftService.getGame(id);
      return rs.data;
    },
    {
      enabled: !!id,
    }
  );

  const TABS = [
    // {
    //   title: "NFTs",
    //   panel: () => <Nfts enableFilter={true} nftCollection={collection.id} />,
    //   key: "nfts",
    // },
    // {
    //   title: "Activities",
    //   panel: () => <UserActivities collection={collection.id} />,
    //   key: "activities",
    // },
  ];
  const tabIndex = tab ? TABS.findIndex((t) => t.key === tab) : 0;
  const { borderColor } = useCustomColors();
  const STATS = [
    // {
    //   label: "items",
    //   value: 100,
    // },
    // {
    //   label: "owner",
    //   value: 100,
    // },
    // {
    //   label: "floor price",
    //   value: "$100",
    // },
    // {
    //   label: "total volume",
    //   value: "$100",
    // },
  ];
  const sliderBox = useStyleConfig("SliderBox");

  return (
    game && (
      <VStack w="full" alignItems="start" spacing={7}>
        <ProfileHeader
          name={game.name}
          avatar={game.avatar}
          cover={game.cover}
          socials={game.socials}
          description={game.description}
          username={game.key}
        >
          {isLoggedIn && profile.roles?.includes(Roles.superAdmin) && (
            <NextLink href={`/game/edit/${game.key}`}>
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
          <Box pt={3}>
            <SimpleGrid columns={[2, 2, 4]} rounded="lg" bg={borderColor}>
              {STATS.map((stat, index) => (
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
        </ProfileHeader>
        <Box w="full">
          <Heading fontSize="2xl">Collections</Heading>
          <Box w="full" position="relative" __css={sliderBox}>
            <ScrollSlide>
              {(game?.collections as NftCollectionDto[])
                ?.filter((c) => c.status === Status.Active)
                ?.map((c, k) => (
                  <Box py={3} pr={3}>
                    <Link
                      as={NextLink}
                      href={`/collection/${c.key}`}
                      key={`GameCollection-${c.id}`}
                    >
                      <Box w="350px" maxW="80vw">
                        <NftCollectionCard collection={c} />
                      </Box>
                    </Link>
                  </Box>
                ))}
            </ScrollSlide>
          </Box>
        </Box>
        <Box w="full">
          <Heading fontSize="2xl">NFTs</Heading>
          <Nfts game={game.id} enableFilter={true} />
        </Box>
        {/* <Tabs defaultIndex={tabIndex || 0} variant="enclosed" w="full" pt={5}>
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
        </Tabs> */}
      </VStack>
    )
  );
}
