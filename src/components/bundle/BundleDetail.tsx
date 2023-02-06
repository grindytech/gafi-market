import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import Icons from "../../images";
import nftService from "../../services/nft.service";
import { selectProfile } from "../../store/profileSlice";
import useCustomColors from "../../theme/useCustomColors";
import EmptyState, { ErrorState } from "../EmptyState";
import LoadingPage from "../LoadingPage";
import { MASKS } from "../nftcard/mask";
import NftCard from "../nftcard/NftCard";
import NextLink from "next/link";
import { HiBadgeCheck } from "react-icons/hi";
import ShareButton from "../ShareButton";
import { getUserName, numeralFormat } from "../../utils/utils";
import Skeleton from "../Skeleton";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import CancelBundle from "./CancelBundle";
import { BundleStatus } from "../../services/types/enum";
import BuyBundle from "./BuyBundle";
import PrimaryButton from "../PrimaryButton";
import { FiArrowRight, FiClock } from "react-icons/fi";
import Countdown from "react-countdown";
import { formatDistance } from "date-fns";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import ScrollSlide from "../hScroll/ScrollSlide";

export default function BundleDetail({ id }: { id: string }) {
  const sliderBox = useStyleConfig("SliderBox");
  const [errorCode, setErrorCode] = useState(0);
  const [bundleStatus, setBundleStatus] = useState<BundleStatus>();
  const {
    data: bundle,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery(
    ["BundleDetail", id],
    async () => {
      const rs = await nftService.getBundle(id);
      return rs.data;
    },
    {
      enabled: !!id,
      onError: (error: AxiosResponse) => {
        setErrorCode(error?.status || 500);
      },
    }
  );
  useEffect(() => {
    setBundleStatus(bundle?.status);
  }, [bundle]);
  const { chainInfo } = useGetChainInfo({ chainId: bundle?.chain });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: bundle?.paymentToken,
  });
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: bundle?.nftCollection,
  });
  const { user } = useSelector(selectProfile);
  const isOwner = useMemo(
    () => user === bundle?.seller?.address,
    [user, bundle]
  );
  const md = useBreakpointValue({ base: false, md: true });
  const { bgColor, borderColor } = useCustomColors();
  const mask = get(MASKS, collectionInfo?.key);
  const bundleName = bundle?.name || `${collectionInfo?.name} bundle`;
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    paymentSymbol: paymentInfo?.symbol,
  });
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
      {bundle && (
        <Stack
          position="relative"
          direction={{ base: "column", md: "row" }}
          w="full"
          spacing={5}
        >
          {md && (
            <VStack
              overflow="auto"
              maxHeight={["auto", "calc(100vh - 90px)"]}
              position={["relative", "sticky"]}
              top={[0, "90px"]}
              w={["full", "50%"]}
              spacing={5}
              p={2}
              rounded="xl"
              borderColor={borderColor}
              bg={bgColor}
              alignItems="start"
            >
              <HStack w="full" justifyContent="start">
                <Tooltip label={chainInfo?.name}>
                  <Icon blur="xl" w={5} h={5}>
                    {Icons.chain[String(chainInfo?.symbol).toUpperCase()]
                      ? Icons.chain[String(chainInfo?.symbol).toUpperCase()]()
                      : ""}
                  </Icon>
                </Tooltip>
                <Heading fontSize="xl">{bundle?.items.length} items</Heading>
              </HStack>
              <SimpleGrid
                justifyContent="center"
                w="full"
                columns={[2, 2, 3, 3]}
                gap="15px"
                px={0}
              >
                {bundle.items.map((nft) => {
                  return (
                    <Link target="_blank" href={`/nft/${nft.id}`}>
                      <NftCard
                        image={nft.image}
                        mask={mask ? mask({ nft: nft }) : <></>}
                      >
                        <HStack
                          alignItems="start"
                          w="full"
                          justifyContent="space-between"
                          p={2}
                        >
                          <VStack spacing={0} alignItems="start">
                            <Text
                              noOfLines={1}
                              fontSize="md"
                              fontWeight="semibold"
                            >
                              {nft?.name || <>&nbsp;</>}
                            </Text>
                            <Text
                              noOfLines={1}
                              color="gray"
                              fontSize="xs"
                              fontWeight="semibold"
                            >
                              #{nft?.tokenId}
                            </Text>
                          </VStack>
                        </HStack>
                      </NftCard>
                    </Link>
                  );
                })}
              </SimpleGrid>
            </VStack>
          )}

          <Box w={["full", "50%"]}>
            <VStack spacing={1} w="full" alignItems="start">
              <HStack w="full" justifyContent="space-between">
                <NextLink href={`/collection/${collectionInfo?.id}`}>
                  <Text color="primary.50" fontWeight="semibold" fontSize="xl">
                    {collectionInfo?.name}{" "}
                    {collectionInfo?.verified && (
                      <Icon color="primary.50" h={4} w={4}>
                        <HiBadgeCheck size="25px" />
                      </Icon>
                    )}
                  </Text>
                </NextLink>
                <HStack>
                  <ShareButton
                    aria-label="share button"
                    title={bundleName}
                    link={window.location.href}
                  />
                </HStack>
              </HStack>
              <Heading>{bundleName}</Heading>
              <Text fontSize="sm">
                Owner by{" "}
                <Link
                  fontWeight="semibold"
                  color="primary.50"
                  href={`/profile/${bundle?.seller.address}`}
                  as={NextLink}
                >
                  {getUserName(bundle?.seller, user)}
                </Link>
              </Text>
              {!md && (
                <VStack pt={3} w="full">
                  <HStack w="full" justifyContent="start">
                    <Tooltip label={chainInfo?.name}>
                      <Icon blur="xl" w={5} h={5}>
                        {Icons.chain[String(chainInfo?.symbol).toUpperCase()]
                          ? Icons.chain[
                              String(chainInfo?.symbol).toUpperCase()
                            ]()
                          : ""}
                      </Icon>
                    </Tooltip>
                    <Heading fontSize="xl">
                      {bundle?.items.length} items
                    </Heading>
                  </HStack>
                  <Box w="full" position="relative" __css={sliderBox}>
                    <ScrollSlide>
                      {bundle.items.map((nft) => {
                        return (
                          <Link target="_blank" href={`/nft/${nft.id}`}>
                            <Box py={3} pr={3} maxW="100%" w="250px">
                              <NftCard
                                image={nft.image}
                                mask={mask ? mask({ nft: nft }) : <></>}
                              >
                                <HStack
                                  alignItems="start"
                                  w="full"
                                  justifyContent="space-between"
                                  p={2}
                                >
                                  <VStack spacing={0} alignItems="start">
                                    <Text
                                      noOfLines={1}
                                      fontSize="md"
                                      fontWeight="semibold"
                                    >
                                      {nft?.name || <>&nbsp;</>}
                                    </Text>
                                    <Text
                                      noOfLines={1}
                                      color="gray"
                                      fontSize="xs"
                                      fontWeight="semibold"
                                    >
                                      #{nft?.tokenId}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </NftCard>
                            </Box>
                          </Link>
                        );
                      })}
                    </ScrollSlide>
                  </Box>
                </VStack>
              )}
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
                        <>
                          <Text fontSize="xl" fontWeight="semibold">
                            {numeralFormat(bundle.price)} {paymentInfo?.symbol}
                          </Text>
                          <Skeleton isLoaded={!isPriceAsUsdLoading}>
                            <Text
                              color="gray"
                              fontWeight="semibold"
                              fontSize="sm"
                            >
                              ~{prefix}
                              {numeralFormat(bundle.price * priceAsUsd)}
                            </Text>
                          </Skeleton>
                        </>
                      </VStack>
                      {bundleStatus === BundleStatus.onSale ? (
                        isOwner ? (
                          <CancelBundle
                            w="full"
                            onSuccess={async () => {
                              setBundleStatus(BundleStatus.cancel);
                            }}
                            bundle={bundle}
                            as={Button}
                            bg="red.500"
                            _hover={{
                              bg: "red.600",
                            }}
                          >
                            Cancel sale
                          </CancelBundle>
                        ) : (
                          <BuyBundle
                            w="full"
                            as={PrimaryButton}
                            bundle={bundle}
                          >
                            Buy now
                          </BuyBundle>
                        )
                      ) : (
                        <Button disabled w="full">
                          {bundleStatus === BundleStatus.cancel
                            ? "Cancelled"
                            : bundleStatus === BundleStatus.expired
                            ? "Expired"
                            : "Sold out"}
                        </Button>
                      )}
                      {bundleStatus === BundleStatus.onSale && (
                        <Tooltip label={new Date(bundle.endTime).toUTCString()}>
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
                                date={bundle.endTime}
                              />
                            </Text>
                          </HStack>
                        </Tooltip>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </Box>
              {bundle.description && (
                <Box pt={3} w="full">
                  <Card rounded="xl" borderWidth={1} p={3}>
                    <Text fontSize="xl" fontWeight="semibold">
                      Description
                    </Text>
                    <CardBody>{bundle.description}</CardBody>
                  </Card>
                </Box>
              )}
              {bundle.buyer && (
                <Box pt={3} w="full">
                  <Card rounded="xl" borderWidth={1} p={3}>
                    <CardBody>
                      <VStack w="full">
                        <HStack
                          w="full"
                          alignItems="start"
                          justifyContent="space-between"
                        >
                          <Button
                            variant="link"
                            as={NextLink}
                            textAlign="left"
                            w="full"
                            href={`/profile/${bundle.seller.address}`}
                          >
                            <Text w="full" textAlign="left" noOfLines={1}>
                              {getUserName(bundle.seller, user)}
                            </Text>
                          </Button>
                          <Icon color="gray" w={6} h={6} fontSize="lg">
                            <FiArrowRight />
                          </Icon>
                          <Button
                            as={NextLink}
                            variant="link"
                            textAlign="right"
                            w="full"
                            href={`/profile/${bundle.buyer.address}`}
                          >
                            <Text w="full" textAlign="right" noOfLines={1}>
                              {getUserName(bundle.buyer, user)}
                            </Text>
                          </Button>
                        </HStack>
                        <HStack justifyContent="end" color="gray">
                          <Tooltip
                            label={new Date(bundle.updatedAt).toUTCString()}
                          >
                            <Text fontSize="sm">
                              {formatDistance(
                                new Date(bundle.updatedAt),
                                Date.now(),
                                {
                                  includeSeconds: false,
                                  addSuffix: true,
                                }
                              )}
                            </Text>
                          </Tooltip>
                          <Link
                            target="_blank"
                            fontSize="sm"
                            href={`${chainInfo?.explore}/tx/${bundle?.txHash}`}
                          >
                            <ExternalLinkIcon />
                          </Link>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
              )}
            </VStack>
          </Box>
        </Stack>
      )}
    </>
  );
}
