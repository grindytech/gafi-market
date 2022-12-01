import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { FiShare } from "react-icons/fi";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Images } from "../../images";
import { accountService } from "../../services/user.service";
import { selectProfile } from "../../store/profileSlice";
import useCustomColors from "../../theme/useCustomColors";
import { shorten } from "../../utils/string.util";
import { useNftQueryParam } from "../filters/useCustomParam";
import Nfts from "../market/Nfts";
const CustomTab = ({ children, ...rest }: TabProps) => {
  return (
    <Tab
      {...rest}
      _selected={{ color: useColorModeValue("black", "white") }}
      color="gray.500"
    >
      <Heading fontSize={{ base: "lg", md: "3xl" }} textTransform="uppercase">
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
    () => user && user?.toLowerCase() === address?.toLowerCase(),
    [user, address]
  );
  const { borderColor } = useCustomColors();
  const { data: viewProfile } = useQuery(["Profile", viewAccount], async () => {
    const rs = await accountService.profileByAddress(viewAccount);
    return rs.data;
  });

  return (
    <VStack w="full" alignItems="start">
      <VStack w="full">
        <Box rounded="xl" bg={borderColor} w="full" height={300}>
          {viewProfile?.cover && (
            <Image
              src={viewProfile?.cover}
              w="full"
              h={300}
              objectFit="cover"
              fallbackSrc={Images.Placeholder.src}
            />
          )}
        </Box>
        <Box position="static">
          <Avatar
            position="absolute"
            left={0}
            top="-50%"
            size={"md"}
            icon={
              <Jazzicon
                diameter={41}
                seed={jsNumberForAddress(String(viewAccount))}
              />
            }
            src={viewProfile?.avatar}
          />
        </Box>
      </VStack>
      <Heading>
        {viewProfile && (viewProfile?.name ?? shorten(viewProfile?.address))}
        {/* {JSON.stringify(viewProfile)} */}
      </Heading>
      <HStack>
        <Button>Edit</Button>
        <Button>
          <FiShare />
        </Button>
      </HStack>
      <Tabs variant="unstyled">
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
  );
}
