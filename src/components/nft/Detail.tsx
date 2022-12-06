import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { HiBadgeCheck } from "react-icons/hi";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useQuery } from "react-query";
import nftService from "../../services/nft.service";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import Skeleton from "../Skeleton";
import NftViewer from "./NftViewer";
import NextLink from "next/link";
import { shorten } from "../../utils/string.util";
import { FiClock, FiRefreshCcw, FiRefreshCw, FiShare } from "react-icons/fi";
import { formatDate, numeralFormat } from "../../utils/utils";
import useCustomColors from "../../theme/useCustomColors";
import BuyButton from "../nftcard/BuyButton";
import OfferButton from "../nftcard/OfferButton";
import PrimaryButton from "../PrimaryButton";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profileSlice";
import { useMemo } from "react";
import CancelBtn from "../nftcard/CancelButton";
import SaleButton from "../nftcard/SaleButton";
import Countdown from "react-countdown";
import { formatDistance } from "date-fns";
import CustomTab from "../CustomTab";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Icons from "../../images";

export default function Detail({ id }: { id: string }) {
  const {
    data: nft,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    ["NftDetail", id],
    async () => {
      const rs = await nftService.getNft(id);
      return rs.data;
    },
    {
      enabled: !!id,
    }
  );
  const { user } = useSelector(selectProfile);
  const isOwner = useMemo(() => user === nft?.owner?.address, [user, nft]);
  const { borderColor } = useCustomColors();
  return (
    <Container maxW="container.lg">
      <Stack
        position="relative"
        direction={{ base: "column", md: "row" }}
        w="full"
      >
        {nft && (
          <VStack w="full" spacing={5}>
            <Box w="full" display="flex" justifyContent="center">
              <Card display="flex" maxW="full" boxShadow="lg" rounded="lg">
                <Skeleton isLoaded={!isLoading}>
                  <CardBody>
                    <NftViewer nft={nft} />
                  </CardBody>
                </Skeleton>
              </Card>
            </Box>
            <Tabs w="full" variant="unstyled" defaultIndex={1}>
              <TabList w="full">
                <HStack
                  // borderWidth={1}
                  boxShadow="md"
                  w="full"
                  bg={useColorModeValue("gray.50", "gray.800")}
                  rounded="xl"
                  px={3}
                  py={1}
                  overflow="auto"
                >
                  <CustomTab>Overview</CustomTab>
                  <CustomTab>Properties</CustomTab>
                  <CustomTab>Offers</CustomTab>
                  <CustomTab>History</CustomTab>
                </HStack>
              </TabList>

              <TabPanels>
                <TabPanel
                  borderWidth={1}
                  rounded="xl"
                  mt={3}
                  // borderTop="none"
                  // borderTopRadius={0}
                >
                  <VStack alignItems="start">
                    <VStack alignItems="start">
                      <Text fontSize="xl" fontWeight="semibold">
                        Description
                      </Text>
                      <Text>{nft.description}</Text>
                    </VStack>
                    <VStack alignItems="start" w="full">
                      <Text fontSize="xl" fontWeight="semibold">
                        Detail
                      </Text>
                      <VStack
                        bg={useColorModeValue("gray.50", "gray.800")}
                        borderWidth={1}
                        p={3}
                        rounded="xl"
                        w="full"
                        alignItems="start"
                        spacing={1}
                        fontSize="md"
                        // fontWeight="semibold"
                        // color="gray"
                      >
                        <HStack w="full" justifyContent="space-between">
                          <Text fontSize="md" fontWeight="semibold">
                            Contract address
                          </Text>
                          <Button
                            target="_blank"
                            size="md"
                            variant="link"
                            as={Link}
                            href={`${nft.chain.explore}/token/${nft.nftContract}`}
                          >
                            {shorten(nft.nftContract)}
                          </Button>
                        </HStack>
                        <HStack w="full" justifyContent="space-between">
                          <Text fontSize="md" fontWeight="semibold">
                            Token id
                          </Text>
                          <Button
                            target="_blank"
                            size="md"
                            variant="link"
                            as={Link}
                            href={`${nft.chain.explore}/token/${nft.nftContract}?a=${nft.tokenId}`}
                          >
                            {nft.tokenId}
                          </Button>
                        </HStack>
                        <HStack w="full" justifyContent="space-between">
                          <Text fontSize="md" fontWeight="semibold">
                            Chain
                          </Text>
                          <Text fontSize="md">{nft.chain.name} </Text>
                        </HStack>
                        <HStack w="full" justifyContent="space-between">
                          <Text fontSize="md" fontWeight="semibold">
                            Token standard
                          </Text>
                          <Text fontSize="md">ERC-721</Text>
                        </HStack>
                        <Box w="full" py={2}>
                          <Divider />
                        </Box>
                        <HStack w="full" justifyContent="end">
                          <Button
                            size="sm"
                            variant="link"
                            as={Link}
                            target="_blank"
                            href={nft.originImage || nft.image}
                          >
                            Open origin&nbsp;
                            <ExternalLinkIcon />
                          </Button>
                          <Button
                            size="sm"
                            variant="link"
                            as={Link}
                            target="_blank"
                            href={nft.externalUrl}
                          >
                            External link&nbsp;
                            <ExternalLinkIcon />
                          </Button>
                        </HStack>
                      </VStack>
                    </VStack>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        )}
        <Box
          position="sticky"
          h={{ base: "auto", md: 500 }}
          top="30px"
          w="full"
        >
          {nft && (
            <VStack
              spacing={1}
              pl={{ base: 0, md: 10 }}
              w="full"
              alignItems="start"
            >
              <HStack w="full" justifyContent="space-between">
                <NextLink href={`/collection/${nft.nftCollection.id}`}>
                  <Text color="primary.50" fontWeight="semibold" fontSize="xl">
                    {nft?.nftCollection.name}{" "}
                    {nft?.nftCollection.verified && (
                      <Icon color="primary.50" h={4} w={4}>
                        <HiBadgeCheck size="25px" />
                      </Icon>
                    )}
                  </Text>
                </NextLink>
                <HStack>
                  <Tooltip label="Share">
                    <IconButton size="sm" aria-label="share">
                      <FiShare />
                    </IconButton>
                  </Tooltip>
                  <Tooltip label="Refresh metadata">
                    <IconButton size="sm" aria-label="refresh metadata">
                      <FiRefreshCw />
                    </IconButton>
                  </Tooltip>
                </HStack>
              </HStack>
              <Heading>{nft.name}</Heading>
              <Text fontSize="sm">
                Owner by{" "}
                <Link
                  fontWeight="semibold"
                  color="primary.50"
                  href={`/profile/${nft.owner.address}`}
                  as={NextLink}
                >
                  {nft.owner.name !== "Unnamed"
                    ? nft.owner.name
                    : shorten(nft.owner.address, 6, 4)}
                </Link>
              </Text>
              <Box pt={3} w="full">
                <Card rounded="xl" borderWidth={1} p={3}>
                  <CardBody>
                    <VStack w="full" spacing={3}>
                      <VStack
                        bg={borderColor}
                        p={3}
                        w="full"
                        rounded="xl"
                        alignItems="start"
                        spacing={1}
                      >
                        <Text>Price</Text>
                        {nft.sale && (
                          <>
                            <Text fontSize="xl" fontWeight="semibold">
                              {numeralFormat(nft.sale.price)}{" "}
                              {nft.sale.paymentToken.symbol}
                            </Text>
                            <Text
                              color="gray"
                              fontWeight="semibold"
                              fontSize="sm"
                            >
                              ~ ${numeralFormat(nft.sale.price)}
                            </Text>
                          </>
                        )}
                        {!nft.sale && (
                          <Text fontSize="xl" fontWeight="semibold">
                            Not for sale
                          </Text>
                        )}
                      </VStack>
                      {isOwner && (
                        <>
                          {nft.sale && (
                            <CancelBtn
                              w="full"
                              onSuccess={() => {
                                refetch();
                              }}
                              nft={nft}
                            >
                              Cancel sale
                            </CancelBtn>
                          )}
                          {!nft.sale && (
                            <SaleButton
                              w="full"
                              onSuccess={() => {
                                refetch();
                              }}
                              nft={nft}
                            >
                              Put on sale
                            </SaleButton>
                          )}
                        </>
                      )}
                      {!isOwner && (
                        <>
                          {nft.sale && (
                            <>
                              <HStack w="full">
                                <BuyButton w="full" nft={nft}>
                                  Buy now
                                </BuyButton>
                              </HStack>
                              <OfferButton nft={nft} w="full">
                                Make offer
                              </OfferButton>
                            </>
                          )}
                          {!nft.sale && (
                            <PrimaryButton as={OfferButton} nft={nft} w="full">
                              Make offer
                            </PrimaryButton>
                          )}
                        </>
                      )}

                      {nft.sale && (
                        <Tooltip
                          label={new Date(nft.sale.endTime).toUTCString()}
                        >
                          <HStack w="full" spacing={1} justifyContent="start">
                            <FiClock color="gray" />
                            <Text
                              w="full"
                              textAlign="left"
                              color="gray"
                              fontSize="sm"
                            >
                              Sale ends in{" "}
                              <Countdown
                                renderer={(time) => {
                                  return (
                                    <>
                                      {time.days}d {time.hours}h {time.minutes}m{" "}
                                      {time.seconds}s
                                    </>
                                  );
                                }}
                                date={nft.sale.endTime}
                              />
                            </Text>
                          </HStack>
                        </Tooltip>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </Box>
              {/* <HStack pt={5} w="full" justifyContent="space-between">
              <HStack w="full">
                <Avatar
                  size="md"
                  src={nft.creator.avatar}
                  icon={
                    <Jazzicon
                      diameter={48}
                      seed={jsNumberForAddress(String(nft.creator.address))}
                    />
                  }
                />
                <VStack alignItems="start" spacing={0}>
                  <Text color="gray">Creator</Text>
                  <Text fontWeight="semibold">
                    {nft.creator.name !== "Unnamed"
                      ? nft.creator.name
                      : shorten(nft.creator.address, 6, 4)}
                  </Text>
                </VStack>
              </HStack>
              <HStack w="full">
                <Avatar
                  size="md"
                  src={nft.creator.avatar}
                  icon={
                    <Jazzicon
                      diameter={48}
                      seed={jsNumberForAddress(String(nft.creator.address))}
                    />
                  }
                />
                <VStack alignItems="start" spacing={0}>
                  <Text color="gray">Owner</Text>
                  <Text fontWeight="semibold">
                    {nft.owner.name !== "Unnamed"
                      ? nft.owner.name
                      : shorten(nft.owner.address, 6, 4)}
                  </Text>
                </VStack>
              </HStack>
            </HStack> */}
            </VStack>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
