import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import { get } from "lodash";
import NextLink from "next/link";
import { useMemo, useState } from "react";
import Countdown from "react-countdown";
import { FiClock } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import nftService from "../../services/nft.service";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { selectProfile } from "../../store/profileSlice";
import useCustomColors from "../../theme/useCustomColors";
import { shorten } from "../../utils/string.util";
import { getUserName, numeralFormat } from "../../utils/utils";
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
import NftViewer from "./NftViewer";
import NftOffers from "./offer/NftOffers";
import RefreshMetadataButton from "./RefreshMetadataButton";
import { STATS } from "./stats";

export default function Detail({ id }: { id: string }) {
  const [errorCode, setErrorCode] = useState(0);
  const {
    data: nft,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery(
    ["NftDetail", id],
    async () => {
      const rs = await nftService.getNft(id);
      return rs.data;
    },
    {
      enabled: !!id,
      onError: (error: AxiosResponse) => {
        setErrorCode(error?.status || 500);
      },
    }
  );
  const { user } = useSelector(selectProfile);
  const isOwner = useMemo(() => user === nft?.owner?.address, [user, nft]);
  const { borderColor } = useCustomColors();
  const md = useBreakpointValue({ base: false, md: true });
  const [loadOfferTime, setLoadOfferRime] = useState(Date.now());
  return isLoading ? (
    <LoadingPage />
  ) : (
    <>
      {isError && errorCode === 404 && (
        <Box w="full" py={100}>
          <EmptyState msg="Item does not exist or has been burned" />
        </Box>
      )}
      {isError && errorCode !== 404 && (
        <Box w="full" py={100}>
          <ErrorState>
            <Button
              onClick={() => {
                refetch();
              }}
            >
              Try again
            </Button>
          </ErrorState>
        </Box>
      )}
      {nft && (
        <Container maxW="container.lg">
          <Stack
            position="relative"
            direction={{ base: "column", md: "row" }}
            w="full"
          >
            <VStack w="full" spacing={5}>
              <Box w="full" display="flex" justifyContent="center">
                <Card display="flex" maxW="full" rounded="lg">
                  <Skeleton isLoaded={!isLoading}>
                    <CardBody>
                      <NftViewer nft={nft} />
                    </CardBody>
                  </Skeleton>
                </Card>
              </Box>
              {md && <NftDetailSection nft={nft} />}
              {md && <NftStatsSection nft={nft} />}
              {md && <NftHistorySection nft={nft} />}
            </VStack>
            <VStack
              position="sticky"
              height={{ base: "auto", md: 610 }}
              spacing={5}
              pl={{ base: 0, md: 10 }}
              w="full"
              top="90px"
            >
              <PriceSection
                onMakeOffer={() => {
                  setLoadOfferRime(Date.now());
                }}
                isOwner={isOwner}
                nft={nft}
                refetch={refetch}
              />
              {!md && <NftDetailSection nft={nft} />}
              {!md && <NftStatsSection nft={nft} />}

              <NftOfferSection
                key={`NftOfferSection-${loadOfferTime}`}
                nft={nft}
              />
              {!md && <NftHistorySection nft={nft} />}
            </VStack>
          </Stack>
        </Container>
      )}
    </>
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
const NftStatsSection = ({ nft }: { nft: NftDto }) => {
  const stats = get(STATS, nft.nftCollection.key);
  return stats ? stats({ nft }) : <></>;
};
const NftDetailSection = ({ nft }: { nft: NftDto }) => {
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
                <Text>{nft.description}</Text>
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
            <NftDetail nft={nft} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

const NftDetail = ({ nft }: { nft: NftDto }) => {
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
            href={`${nft.chain.explore}/token/${nft.nftContract}`}
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
            href={`${nft.chain.explore}/token/${nft.nftContract}?a=${nft.tokenId}`}
          >
            {nft.tokenId}
          </Button>
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Text fontSize="md">Chain</Text>
          <Text fontSize="md">{nft.chain.name} </Text>
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
            href={nft.originImage || nft.image}
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
                <Text fontSize="xl">{String(attr.value)}</Text>
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
}: {
  nft: NftDto;
  refetch: any;
  isOwner: boolean;
  onMakeOffer?: () => void;
}) => {
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: !!nft?.sale,
    paymentSymbol: nft?.sale?.paymentToken.symbol,
  });
  const { borderColor } = useCustomColors();
  const { user } = useSelector(selectProfile);
  return (
    <VStack spacing={1} w="full" alignItems="start">
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
          <ShareButton
            aria-label="share button"
            title={`${nft.nftCollection.name} | ${nft.name}`}
            link={window.location.href}
          />
          <Tooltip label="Refresh metadata">
            <RefreshMetadataButton nftId={nft.id} />
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
                      {numeralFormat(nft.sale.price)}{" "}
                      {nft.sale.paymentToken.symbol}
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
                        await nftService.cancelSale(nft.id);
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
                        <AddToCartButton nft={nft} />
                      </HStack>
                      <OfferButton
                        onSuccess={() => {
                          onMakeOffer && onMakeOffer();
                        }}
                        nft={nft}
                        w="full"
                      >
                        Make offer
                      </OfferButton>
                    </>
                  )}
                  {!nft.sale && (
                    <PrimaryButton
                      onSuccess={() => {
                        onMakeOffer && onMakeOffer();
                      }}
                      as={OfferButton}
                      nft={nft}
                      w="full"
                    >
                      Make offer
                    </PrimaryButton>
                  )}
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
