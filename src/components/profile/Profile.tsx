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
import { EmptyState } from "../EmptyState";
import Nfts from "../market/Nfts";
import UserActivities from "./Activities";
import OfferMade from "./OfferMade";
import ProfileHeader from "./ProfileHeader";
const CustomTab = ({ children, ...rest }: TabProps) => {
  return (
    <Tab
      {...rest}
      _selected={{ color: useColorModeValue("black", "white") }}
      color="gray.500"
      overflow="visible"
    >
      <Heading
        whiteSpace="nowrap"
        noOfLines={1}
        fontSize={{ base: "lg", md: "xl" }}
      >
        {children}
      </Heading>
    </Tab>
  );
};

export default function Profile({ address }: { address?: string }) {
  const { user } = useSelector(selectProfile);
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "nfts"));
  const viewAccount = useMemo(
    () => (address || user)?.toLowerCase(),
    [address, user]
  );
  const { data: viewProfile } = useQuery(
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
      panel: () => <Nfts owner={viewAccount} enableFilter={true} />,
      key: "nfts",
    },
    {
      title: "Activities",
      panel: () => <UserActivities address={viewAccount} />,
      key: "activities",
    },
    {
      title: "Offers made",
      panel: () => <OfferMade key={`OfferMade-made`} address={viewAccount} />,
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

  return viewProfile ? (
    <VStack w="full" alignItems="start" spacing={5}>
      <ProfileHeader
        address={viewProfile.address}
        name={name}
        avatar={viewProfile.avatar}
        cover={viewProfile.cover}
        socials={viewProfile.socials}
        username={viewProfile.username}
        description={viewProfile.bio}
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
  ) : (
    !address && (
      <Box py={10}>
        <EmptyState
          title="No connect yet"
          msg="Connect wallet to see your profile!"
        >
          <ConnectWalletButton />
        </EmptyState>
      </Box>
    )
  );
}
