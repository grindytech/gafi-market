import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Image,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { Images } from "../../images";
import nftService from "../../services/nft.service";
import { OfferDto } from "../../services/types/dtos/Offer.dto";
import Skeleton from "../Skeleton";
import NextLink from "next/link";
import { HiBadgeCheck } from "react-icons/hi";
import { getUserName, numeralFormat, shorten } from "../../utils/utils";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profileSlice";
import { formatDistance } from "date-fns";
import { OfferStatus } from "../../services/types/enum";
import CancelOfferButton from "../nft/offer/CancelOfferButton";
import { EmptyState, ErrorState } from "../EmptyState";
import useCustomColors from "../../theme/useCustomColors";
import { GetOffers } from "../../services/types/params/GetOffers";
import AcceptOfferButton from "../nft/offer/AcceptOfferButton";

export default function OfferMade({
  address,
  receive,
}: {
  address: string;
  receive?: boolean;
}) {
  const {
    data,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["UserOffersMade", address, receive],
    async ({ pageParam = 1 }) => {
      const param: GetOffers = {
        page: pageParam,
        orderBy: "createdAt",
        desc: "desc",
        optional: true,
      };
      if (!receive) param.buyer = address;
      else param.seller = address;
      console.log(receive);
      console.log(param);

      const rs = await nftService.getOffers(param);
      return rs.data;
    },
    {
      enabled: !!address,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage.hasPrevious ? firstPage.currentPage - 1 : undefined,
      onSuccess: () => {},
      onError: (error) => {
        console.error(error);
      },
    }
  );
  const offers = useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data]
  );
  const loadingRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: loadingRef,
    onIntersect: fetchNextPage,
    enabled: !isLoading && !isFetching && hasNextPage,
  });
  const isEmpty = useMemo(
    () => !isError && !isLoading && !isFetching && offers.length === 0,
    [isError, isLoading, isFetching, offers.length]
  );
  const md = useBreakpointValue({ base: false, md: true });
  const { bgColor } = useCustomColors();
  return (
    <VStack w="full">
      {isEmpty && (
        <Box w="full" py={10}>
          <EmptyState msg="No offers found" />
        </Box>
      )}
      {isError && (
        <Box w="full" py={10}>
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
      {!isLoading && !isError && !isEmpty && (
        <TableContainer w="full" overflow="auto">
          <Table>
            <Thead>
              <Tr>
                <Th>Item</Th>
                <Th>Price</Th>
                <Th>From</Th>
                <Th>Expiration</Th>
                <Th>Date</Th>
                <Th top={0} bg={bgColor} right={0} w={200} position={"sticky"}>
                  Status
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {offers.map((offer, index) => (
                <OfferListItem
                  key={`OfferListItem-${offer.id}`}
                  offer={offer}
                  onSuccess={refetch}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </VStack>
  );
}

function OfferListItem({
  offer,
  loading,
  onSuccess,
}: {
  loading?: boolean;
  offer?: OfferDto;
  onSuccess: () => void;
}) {
  const { bgColor } = useCustomColors();
  const { user } = useSelector(selectProfile);
  const isOfferOwner = useMemo(
    () =>
      user &&
      offer &&
      user.toLowerCase() === String(offer?.buyer.address).toLowerCase(),
    [user, offer]
  );
  const isNftOwner = useMemo(
    () =>
      user &&
      offer &&
      user.toLowerCase() === String(offer?.seller.address).toLowerCase(),
    [user, offer]
  );
  return (
    <Tr>
      <Td>
        <Skeleton w="full" isLoaded={!loading}>
          <HStack w="full">
            <Image
              src={offer?.image}
              rounded="md"
              fallbackSrc={Images.Placeholder.src}
              w={14}
              h={14}
            />
            <VStack
              overflow="hidden"
              minW={200}
              w="full"
              spacing={0}
              alignItems="start"
            >
              {offer?.nftCollection ? (
                <Link
                  w="full"
                  as={NextLink}
                  href={`/collection/${offer?.nftContract}`}
                >
                  <Text
                    overflow="hidden"
                    noOfLines={1}
                    color="primary.50"
                    fontWeight="semibold"
                    fontSize="xs"
                  >
                    {offer?.nftCollection.name}{" "}
                    {offer?.nftCollection.verified && (
                      <Icon color="primary.50" h={3} w={3}>
                        <HiBadgeCheck size="25px" />
                      </Icon>
                    )}
                  </Text>
                </Link>
              ) : (
                <Box />
              )}
              <Link
                overflow="hidden"
                noOfLines={1}
                as={NextLink}
                href={`/nft/${offer?.nftContract}:${offer?.tokenId}`}
              >
                <Text>{offer?.name}</Text>
              </Link>
              <Text noOfLines={1} fontSize="xs" color="gray.400">
                #{offer?.tokenId}
              </Text>
            </VStack>
          </HStack>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <VStack spacing={0} alignItems="start">
            {offer?.offerPrice && (
              <Text noOfLines={1} fontSize="sm" color="gray">
                {`${numeralFormat(offer?.offerPrice)} ${
                  offer?.paymentToken?.symbol
                }`}{" "}
              </Text>
            )}
            {/* {offer?.priceInUsd && (
              <Text noOfLines={1} fontSize="xs" color="gray.500">
                &nbsp;${numeralFormat(history?.priceInUsd)}
              </Text>
            )} */}
          </VStack>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <Button
            as={NextLink}
            variant="link"
            w="full"
            href={`/profile/${offer?.buyer?.address}`}
          >
            <Text w="full" textAlign="left" noOfLines={1}>
              {getUserName(offer?.buyer, user)}
            </Text>
          </Button>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          {offer.period / (60 * 60 * 24)} days
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!loading}>
          <HStack justifyContent="start" color="gray">
            <Tooltip label={new Date(offer?.createdAt).toUTCString()}>
              <Text textAlign="left" fontSize="sm">
                {formatDistance(new Date(offer?.createdAt || 0), Date.now(), {
                  includeSeconds: false,
                  addSuffix: true,
                })}
              </Text>
            </Tooltip>
          </HStack>
        </Skeleton>
      </Td>
      <Td top={0} right={0} bg={bgColor} w={200} position={"sticky"}>
        {isOfferOwner && offer.status === OfferStatus.pending && (
          <CancelOfferButton
            color="red.300"
            size="xs"
            variant="outline"
            offer={offer}
            onSuccess={() => {
              offer.status = OfferStatus.cancelled;
              onSuccess();
            }}
          >
            Cancel
          </CancelOfferButton>
        )}
        {isNftOwner && offer.status === OfferStatus.pending && (
          <AcceptOfferButton
            nft={offer.nft}
            offer={offer}
            onSuccess={async () => {
              await nftService.acceptOffer(offer.id);
              offer.status = OfferStatus.accepted;
              onSuccess();
            }}
            color="green.300"
            size="xs"
            variant="outline"
          >
            Accept
          </AcceptOfferButton>
        )}
        {!isOfferOwner &&
          !isNftOwner &&
          offer?.status === OfferStatus.pending && (
            <Badge size="xs" rounded="xl">
              Pending
            </Badge>
          )}
        {offer?.status === OfferStatus.cancelled && (
          <Badge size="xs" rounded="xl" color="red.400">
            Canceled
          </Badge>
        )}
        {offer?.status === OfferStatus.accepted && (
          <Badge size="xs" rounded="xl" color="green.400">
            Accepted
          </Badge>
        )}
        {offer?.status === OfferStatus.expired && (
          <Badge size="xs" rounded="xl">
            Expired
          </Badge>
        )}
      </Td>
    </Tr>
  );
}
