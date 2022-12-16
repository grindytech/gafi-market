import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  IconButton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { isEmpty, isError } from "lodash";
import { useMemo } from "react";
import {
  FaDiscord,
  FaFacebook,
  FaGlobe,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import useCustomToast from "../../hooks/useCustomToast";
import { Socials } from "../../services/types/dtos/Socials";
import { accountService } from "../../services/user.service";
import { selectProfile } from "../../store/profileSlice";
import { shorten } from "../../utils/string.util";
import Avatar from "../Avatar";
import Nfts from "../market/Nfts";
import ShareButton from "../ShareButton";
const CustomTab = ({ children, ...rest }: TabProps) => {
  return (
    <Tab
      {...rest}
      _selected={{ color: useColorModeValue("black", "white") }}
      color="gray.500"
    >
      <Heading fontSize={{ base: "lg", md: "xl" }} textTransform="uppercase">
        {children}
      </Heading>
    </Tab>
  );
};
export default function Profile({ address }: { address?: string }) {
  const { user } = useSelector(selectProfile);
  const viewAccount = useMemo(
    () => (address || user)?.toLowerCase(),
    [address, user]
  );
  const isOwner = useMemo(
    () => user && (!address || user?.toLowerCase() === address?.toLowerCase()),
    [user, address]
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
  const toast = useCustomToast();
  const name =
    viewProfile && (viewProfile?.name ?? shorten(viewProfile?.address, 7, 5));
  return (
    viewProfile && (
      <VStack w="full" alignItems="start" spacing={5}>
        <VStack w="full" position="relative">
          <Box
            rounded="xl"
            bgImage={viewProfile?.cover}
            bg={useColorModeValue("gray.200", "gray.800")}
            w="full"
            pt="25%"
            minH="200px"
            position="relative"
          >
            <Box position="absolute" w="full" h="full" top={0} left={0}>
              <VStack h="full" w="full" alignItems="start" justifyContent="end">
                <HStack justifyContent="space-between" p={3} w="full">
                  <Box></Box>
                  <HStack>
                    <Social socials={viewProfile?.socials} />
                    <ShareButton
                      rounded="full"
                      size="sm"
                      aria-label="share"
                      title={name}
                      link={window.location.href}
                    />
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          </Box>
          <VStack position="relative" px={3} pt={2} w="full" alignItems="start">
            <Box position="absolute" px={3} left={0} top={-14}>
              <Avatar
                size={"lg"}
                jazzicon={{
                  diameter: 64,
                  seed: String(viewAccount),
                }}
                src={viewProfile?.avatar}
              />
            </Box>
            <VStack alignItems="start" w="full">
              <VStack alignItems="start" spacing={0}>
                <Heading fontSize={{ base: "xl", md: "3xl" }}>{name}</Heading>
                <HStack justifyContent="start" w="full">
                  {viewProfile?.username &&
                    viewProfile?.username !== viewProfile?.address && (
                      <Text size="sm">@{viewProfile.username}</Text>
                    )}
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        String(viewProfile?.address)
                      );
                      toast.success("Copied!");
                    }}
                    rightIcon={<CopyIcon color="gray" />}
                    variant="link"
                    _hover={{
                      textDecoration: "none",
                    }}
                  >
                    <Text size="sm" color="gray">
                      {shorten(viewProfile?.address, 5, 3)}
                    </Text>
                  </Button>
                </HStack>
              </VStack>
              {viewProfile.bio && <Text size="sm">{viewProfile.bio}</Text>}
            </VStack>
          </VStack>
        </VStack>

        <Tabs variant="enclosed" w="full" pt={5}>
          <TabList>
            <CustomTab pl={0}>NFTs</CustomTab>
            <CustomTab>Activities</CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Nfts owner={viewAccount} />
            </TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    )
  );
}

const SOCIAL_ITEMS_ICONS = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  discord: FaDiscord,
  telegram: FaTelegram,
  website: FaGlobe,
};
const SOCIAL_ITEMS = ["facebook", "twitter", "discord", "telegram", "website"];
const Social = ({ socials }: { socials: Socials }) => {
  return (
    <HStack>
      {SOCIAL_ITEMS.map((item) => {
        const social = socials ? socials[item] : undefined;
        return (
          social && (
            <IconButton
              onClick={() => {
                window.open(social, "_blank");
              }}
              rounded="full"
              size="sm"
              aria-label=""
            >
              {SOCIAL_ITEMS_ICONS[item] ? SOCIAL_ITEMS_ICONS[item]() : <></>}
            </IconButton>
          )
        );
      })}
    </HStack>
  );
};
