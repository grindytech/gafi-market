import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { accountService } from "../../services/user.service";
import { selectProfile } from "../../store/profileSlice";
import { shorten } from "../../utils/string.util";
import ConnectWalletButton from "../connectWalletButton/ConnectWalletButton";
import CustomTab from "../CustomTab";
import { EmptyState } from "../EmptyState";
import Nfts from "../market/Nfts";
import UserActivities from "./Activities";
import OfferMade from "./OfferMade";
import ProfileHeader from "./ProfileHeader";

export default function Profile({ address }: { address?: string }) {
  const { user } = useSelector(selectProfile);
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "nfts"));
  const viewAccount = useMemo(
    () => (address || user)?.toLowerCase(),
    [address, user]
  );
  const { data: viewProfile, isLoading } = useQuery(
    ["Profile", viewAccount],
    async () => {
      const rs = await accountService.profileByAddress(viewAccount);
      return rs.data;
    },
    {
      enabled: !!viewAccount,
    }
  );
  const name =
    viewProfile && (viewProfile?.name ?? shorten(viewProfile?.address, 7, 5));

  const TABS = [
    {
      title: "NFTs",
      panel: () => (
        <Box w="full">
          <Nfts owner={viewProfile.address} enableFilter={true} />
        </Box>
      ),
      key: "nfts",
    },
    {
      title: "Activities",
      panel: () => <UserActivities address={viewProfile.address} />,
      key: "activities",
    },
    {
      title: "Offers made",
      panel: () => (
        <OfferMade key={`OfferMade-made`} address={viewProfile.address} />
      ),
      key: "offers-made",
    },
    {
      title: "Offers receive",
      panel: () => (
        <OfferMade
          key={`OfferMade-receive`}
          address={viewAccount}
          receive={true}
        />
      ),
      key: "offers-receive",
    },
  ];
  const tabIndex = tab ? TABS.findIndex((t) => t.key === tab) : 0;

  return (
    viewProfile && (
      <VStack w="full" alignItems="start" spacing={5}>
        <ProfileHeader
          address={viewProfile.address}
          name={name}
          avatar={viewProfile.avatar}
          cover={viewProfile.cover}
          socials={viewProfile.socials}
          username={viewProfile.username}
          description={viewProfile.about}
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
