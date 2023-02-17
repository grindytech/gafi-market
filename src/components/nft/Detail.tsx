import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import linkifyStr from "linkify-string";
import { get } from "lodash";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Countdown from "react-countdown";
import { FiClock, FiRefreshCw } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import nftService from "../../services/nft.service";
import { ChainDto } from "../../services/types/dtos/ChainDto";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import { PaymentToken } from "../../services/types/dtos/PaymentToken.dto";
import { selectProfile } from "../../store/profileSlice";
import useCustomColors from "../../theme/useCustomColors";
import { shorten } from "../../utils/string.util";
import { convertIpfsLink, getUserName, numeralFormat } from "../../utils/utils";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import { EmptyState, ErrorState } from "../EmptyState";
import LoadingPage from "../LoadingPage";
import { AddToCartButton } from "../nftcard/AddToCartButton";
import BuyButton from "../nftcard/BuyButton";
import CancelBtn from "../nftcard/CancelButton";
import OfferButton from "../nftcard/OfferButton";
import SaleButton from "../nftcard/SaleButton";
import PrimaryButton from "../PrimaryButton";
import ShareButton from "../ShareButton";
import Skeleton from "../Skeleton";
import NftHistory from "./NftHistory";
import NftOffers from "./offer/NftOffers";
import RefreshMetadataButton from "./RefreshMetadataButton";
import { STATS } from "./stats";
import NftViewer from "./viewer/NftViewer";

export default function Detail({ nft }: { nft: NftDto }) {
  const { chainInfo } = useGetChainInfo({ chainId: nft?.chain });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: nft?.sale?.paymentToken,
  });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: nft?.nftCollection,
  });

  const { user } = useSelector(selectProfile);
  const isOwner = useMemo(() => user === nft?.owner?.address, [user, nft]);
  const { borderColor } = useCustomColors();
  const md = useBreakpointValue({ base: false, md: true });
  const [loadOfferTime, setLoadOfferRime] = useState(Date.now());
  const route = useRouter();
  return (
    <Stack
      position="relative"
      direction={{ base: "column", md: "row" }}
      w="full"
      spacing={5}
    >
      <VStack w="full" spacing={5}>
        <Box w="full" display="flex" justifyContent="center">
          <Card
            overflow="hidden"
            boxShadow="md"
            borderWidth={1}
            rounded="xl"
            p={0}
            h="full"
            display="flex"
            maxW="full"
          >
            <CardBody h="full" w="full">
              {nft.image ? (
                <NftViewer nft={nft} />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  w="full"
                  h="full"
                  position="relative"
                >
                  <Box
                    position="absolute"
                    w="full"
                    h="full"
                    bgImage={
                      collectionInfo?.featuredImage || collectionInfo?.cover
                    }
                    bgPosition="center center"
                    bgSize="cover"
                    filter="blur(30px)"
                  ></Box>
                  <Avatar size="2xl" src={collectionInfo?.avatar} />
                </Box>
              )}
            </CardBody>
          </Card>
        </Box>
        {md && <NftDetailSection chain={chainInfo} nft={nft} />}
        {md && <NftStatsSection nftCollection={collectionInfo} nft={nft} />}
        {md && <NftHistorySection nft={nft} />}
      </VStack>
      <VStack
        position="sticky"
        height={{ base: "auto", md: "800px" }}
        spacing={5}
        pl={{ base: 0, md: 10 }}
        w="full"
        top="90px"
      >
        <PriceSection
          nftCollection={collectionInfo}
          paymentToken={paymentInfo}
          onMakeOffer={() => {
            setLoadOfferRime(Date.now());
          }}
          isOwner={isOwner}
          nft={nft}
          refetch={() => {
            route.replace(window.location.href);
          }}
        />
        {!md && <NftDetailSection chain={chainInfo} nft={nft} />}
        {!md && <NftStatsSection nftCollection={collectionInfo} nft={nft} />}

        <NftOfferSection key={`NftOfferSection-${loadOfferTime}`} nft={nft} />
        {!md && <NftHistorySection nft={nft} />}
      </VStack>
    </Stack>
  );
}
const NftHistorySection = ({ nft }: { nft: NftDto }) => {
  return (
    <Box
      borderTop="none"
      borderBottom="none"
      w="full"
      borderWidth={1}
      rounded="xl"
      overflow="hidden"
    >
      <Accordion w="full" defaultIndex={[0]} allowToggle>
        <AccordionItem w="full">
          <AccordionButton
            _hover={{ bg: "none" }}
            w="full"
            justifyContent="space-between"
          >
            <Text fontSize="xl" fontWeight="semibold">
              Histories
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={2} pb={4} overflow="auto" maxH={400}>
            <NftHistory nft={nft} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
const NftOfferSection = ({ nft }: { nft: NftDto }) => {
  return (
    <Box
      borderTop="none"
      borderBottom="none"
      w="full"
      borderWidth={1}
      rounded="xl"
      overflow="hidden"
    >
      <Accordion w="full" defaultIndex={[0]} allowToggle>
        <AccordionItem w="full">
          <AccordionButton
            _hover={{ bg: "none" }}
            w="full"
            justifyContent="space-between"
          >
            <Text fontSize="xl" fontWeight="semibold">
              Offers
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={2} pb={4} overflow="auto" maxH={200}>
            <NftOffers nft={nft} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
const NftStatsSection = ({
  nft,
  nftCollection,
}: {
  nft: NftDto;
  nftCollection: NftCollectionDto;
}) => {
  const stats = get(STATS, nftCollection?.key);
  return stats ? stats({ nft }) : <></>;
};
const NftDetailSection = ({ nft, chain }: { nft: NftDto; chain: ChainDto }) => {
  return (
    <Box
      borderTop="none"
      borderBottom="none"
      w="full"
      borderWidth={1}
      rounded="xl"
      overflow="hidden"
    >
      <Accordion w="full" defaultIndex={[0, 1, 2, 3]} allowMultiple>
        {nft.description && (
          <AccordionItem w="full">
            <AccordionButton
              _hover={{ bg: "none" }}
              w="full"
              justifyContent="space-between"
            >
              <Text fontSize="xl" fontWeight="semibold">
                Description
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Box w="full" maxH={150} overflow="auto">
                <Text
                  dangerouslySetInnerHTML={{
                    __html: linkifyStr(nft.description),
                  }}
                ></Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        )}
        {nft.attributes && nft.attributes.length > 0 && (
          <AccordionItem>
            <AccordionButton
              _hover={{ bg: "none" }}
              w="full"
              justifyContent="space-between"
            >
              <Text fontSize="xl" fontWeight="semibold">
                Properties
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Properties nft={nft} />
            </AccordionPanel>
          </AccordionItem>
        )}
        <AccordionItem>
          <AccordionButton
            _hover={{ bg: "none" }}
            w="full"
            justifyContent="space-between"
          >
            <Text fontSize="xl" fontWeight="semibold">
              Detail
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <NftDetail chain={chain} nft={nft} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

const NftDetail = ({ nft, chain }: { nft: NftDto; chain: ChainDto }) => {
  return (
    <VStack alignItems="start" w="full">
      <VStack
        // bg={useColorModeValue("gray.50", "gray.800")}
        // borderWidth={1}
        // p={3}
        // rounded="xl"
        w="full"
        alignItems="start"
        spacing={1}
        fontSize="md"
        // fontWeight="semibold"
        // color="gray"
      >
        <HStack w="full" justifyContent="space-between">
          <Text fontSize="md">Contract address</Text>
          <Button
            fontWeight="normal"
            target="_blank"
            size="md"
            variant="link"
            as={Link}
            href={`${chain?.explore}/token/${nft.nftContract}`}
          >
            {shorten(nft.nftContract)}
          </Button>
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Text fontSize="md">Token id</Text>
          <Button
            fontWeight="normal"
            target="_blank"
            size="md"
            variant="link"
            as={Link}
            href={convertIpfsLink(nft.tokenUrl)}
          >
            {nft.tokenId}
          </Button>
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Text fontSize="md">Chain</Text>
          <Text fontSize="md">{chain?.name} </Text>
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Text fontSize="md">Token standard</Text>
          <Text fontSize="md">ERC-721</Text>
        </HStack>
        <Box w="full" py={2}>
          <Divider />
        </Box>
        <HStack w="full" justifyContent="end">
          <Button
            size="sm"
            fontWeight="normal"
            variant="link"
            as={Link}
            target="_blank"
            href={convertIpfsLink(
              (String(nft.animationPlayType).includes("video") &&
                nft.animationUrl) ||
                nft.originImage ||
                nft.image
            )}
          >
            Open origin&nbsp;
            <ExternalLinkIcon />
          </Button>
          {nft.externalUrl && (
            <Button
              size="sm"
              variant="link"
              fontWeight="normal"
              as={Link}
              target="_blank"
              href={nft.externalUrl}
            >
              External link&nbsp;
              <ExternalLinkIcon />
            </Button>
          )}
        </HStack>
      </VStack>
    </VStack>
  );
};

const Properties = ({ nft }: { nft: NftDto }) => {
  return (
    <VStack w="full" alignItems="start">
      <SimpleGrid w="full" columns={2} spacing={2}>
        {nft.attributes
          .filter((a) => typeof a.value !== "object")
          .sort((a, b) => a.key.localeCompare(b.key))
          .map((attr) => {
            return (
              <VStack
                borderWidth={1}
                p={3}
                rounded="xl"
                borderColor="primary.100"
                spacing={1}
              >
                <Text color="primary.100" fontSize="sm">
                  {attr.key}
                </Text>
                <Text fontSize={["md", "xl"]}>
                  {attr.value === true
                    ? "Yes"
                    : attr.value === false
                    ? "No"
                    : String(attr.value)}
                </Text>
              </VStack>
            );
          })}
      </SimpleGrid>
    </VStack>
  );
};

const PriceSection = ({
  nft,
  refetch,
  isOwner,
  onMakeOffer,
  paymentToken,
  nftCollection,
}: {
  nft: NftDto;
  refetch: any;
  isOwner: boolean;
  onMakeOffer?: () => void;
  paymentToken: PaymentToken;
  nftCollection: NftCollectionDto;
}) => {
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: !!nft?.sale,
    paymentSymbol: paymentToken?.symbol,
  });
  const { borderColor } = useCustomColors();
  const { user } = useSelector(selectProfile);
  return (
    <VStack spacing={1} w="full" alignItems="start">
      <HStack w="full" justifyContent="space-between">
        <NextLink href={`/collection/${nftCollection?.id}`}>
          <Text color="primary.50" fontWeight="semibold" fontSize="xl">
            {nftCollection?.name}{" "}
            {nftCollection?.verified && (
              <Icon color="primary.50" h={4} w={4}>
                <HiBadgeCheck size="25px" />
              </Icon>
            )}
          </Text>
        </NextLink>
        <HStack>
          <ShareButton
            aria-label="share button"
            title={`${nftCollection?.name} | ${nft?.name}`}
            link={typeof window !== "undefined" ? window?.location.href : "#"}
          />
          <RefreshMetadataButton nftId={nft.id}>
            <Tooltip label="Refresh metadata">
              <IconButton size="sm" aria-label="refresh metadata">
                <FiRefreshCw />
              </IconButton>
            </Tooltip>
          </RefreshMetadataButton>
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
          {getUserName(nft.owner, user)}
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
                      {numeralFormat(nft.sale.price)} {paymentToken?.symbol}
                    </Text>
                    <Skeleton isLoaded={!isPriceAsUsdLoading}>
                      <Text color="gray" fontWeight="semibold" fontSize="sm">
                        ~{prefix}
                        {numeralFormat(nft.sale.price * priceAsUsd)}
                      </Text>
                    </Skeleton>
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
                      onSuccess={async () => {
                        refetch();
                      }}
                      nft={nft}
                      as={Button}
                      bg="red.500"
                      _hover={{
                        bg: "red.600",
                      }}
                      color="white"
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
                      as={PrimaryButton}
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
                        <BuyButton as={PrimaryButton} w="60%" nft={nft}>
                          Buy now
                        </BuyButton>
                        <AddToCartButton
                          showIcon={true}
                          as={Button}
                          w="40%"
                          nft={nft}
                        />
                      </HStack>
                    </>
                  )}
                  <OfferButton
                    onSuccess={() => {
                      onMakeOffer && onMakeOffer();
                    }}
                    as={Button}
                    nft={nft}
                    w="full"
                  >
                    Make offer
                  </OfferButton>
                </>
              )}

              {nft.sale && (
                <Tooltip label={new Date(nft.sale.endTime).toUTCString()}>
                  <HStack w="full" spacing={1} justifyContent="start">
                    <FiClock color="gray" />
                    <Text w="full" textAlign="left" color="gray" fontSize="sm">
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
  );
};
