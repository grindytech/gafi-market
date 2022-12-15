import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
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
import { useMemo } from "react";
import { FiShare } from "react-icons/fi";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import useCustomToast from "../../hooks/useCustomToast";
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
        <VStack w="full">
          <Box
            rounded="xl"
            bgImage={viewProfile?.cover}
            bg={useColorModeValue("gray.50", "gray.800")}
            w="full"
            height={300}
            position="relative"
          >
            <Box position="absolute" w="full" bottom={0} left={0}>
              <HStack justifyContent="space-between" p={5} w="full">
                <HStack>
                  <Avatar
                    size={"lg"}
                    jazzicon={{
                      diameter: 64,
                      seed: String(viewAccount),
                    }}
                    src={viewProfile?.avatar}
                  />
                  <VStack alignItems="start" spacing={0}>
                    <Heading fontSize={{ base: "xl", md: "3xl" }}>
                      {name}
                    </Heading>
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
                </HStack>
                <HStack>
                  {isOwner && <Button>Edit</Button>}
                  <ShareButton
                    size='md'
                    aria-label="share"
                    title={name}
                    link={window.location.href}
                  />
                </HStack>
              </HStack>
            </Box>
          </Box>
        </VStack>

        <Tabs variant="enclosed" w="full" pt={5}>
          <TabList>
            <CustomTab pl={0}>NFTs</CustomTab>
            <CustomTab>Activities</CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              {viewAccount && <Nfts owner={viewAccount} />}
            </TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    )
  );
}
