import {
  Badge,
  Box,
  Button,
  HStack,
  Link,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import NextLink from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useCustomToast from "../../../hooks/useCustomToast";
import { useTokenUSDPrice } from "../../../hooks/useTokenUSDPrice";
import nftService from "../../../services/nft.service";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { OfferDto } from "../../../services/types/dtos/Offer.dto";
import { OfferStatus } from "../../../services/types/enum";
import { selectProfile } from "../../../store/profileSlice";
import { shorten } from "../../../utils/string.util";
import { numeralFormat } from "../../../utils/utils";
import Avatar from "../../Avatar";
import AcceptOfferButton from "./AcceptOfferButton";
import CancelOfferButton from "./CancelOfferButton";

export default function OfferListItem({
  offer,
  loading,
  isOwner,
  nft,
  refetch,
}: {
  loading?: boolean;
  offer?: OfferDto;
  isOwner?: boolean;
  nft?: NftDto;
  refetch: () => void;
}) {
  const buyerName = useMemo(
    () =>
      offer?.buyer.username && offer?.buyer.username !== offer?.buyer.address
        ? offer?.buyer.username
        : shorten(offer?.buyer.address || "", 6, 4),
    [offer?.buyer]
  );
  const { user } = useSelector(selectProfile);
  const { priceAsUsd, prefix, isPriceAsUsdLoading } = useTokenUSDPrice({
    paymentSymbol: offer?.paymentToken.symbol,
  });
  const isOfferOwner = useMemo(
    () =>
      user &&
      offer &&
      user.toLowerCase() === String(offer?.buyer.address).toLowerCase(),
    [user, offer]
  );
  return (
    <HStack w="full" justifyContent="space-between">
      <HStack spacing={2} alignItems="center">
        <Skeleton isLoaded={!loading}>
          <Avatar
            w="40px"
            h="40px"
            jazzicon={{
              diameter: 40,
              seed: offer?.buyer.address || "",
            }}
          />
        </Skeleton>

        <VStack
          overflow="hidden"
          w="full"
          spacing={0}
          alignItems="start"
          justifyContent="center"
        >
          <Skeleton isLoaded={!loading}>
            <HStack>
              <Link
                fontWeight="semibold"
                color="primary.50"
                href={`/profile/${offer?.buyer.address}`}
                as={NextLink}
                height="1.3em"
                overflow="hidden"
                display="block"
                textOverflow="ellipsis"
                title={buyerName}
              >
                <Text fontSize="md" fontWeight="semibold">
                  {buyerName}
                </Text>
              </Link>
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
              {isOfferOwner && offer.status === OfferStatus.pending && (
                <CancelOfferButton
                  color="red.300"
                  size="xs"
                  variant="outline"
                  offer={offer}
                  onSuccess={() => {
                    offer.status = OfferStatus.cancelled;
                    refetch();
                  }}
                >
                  Cancel
                </CancelOfferButton>
              )}
              {isOwner && offer.status === OfferStatus.pending && (
                <AcceptOfferButton
                  nft={nft}
                  offer={offer}
                  onSuccess={async () => {
                    await nftService.acceptOffer(offer.id);
                    offer.status = OfferStatus.accepted;
                    refetch();
                    debugger
                  }}
                  color="green.300"
                  size="xs"
                  variant="outline"
                >
                  Accept
                </AcceptOfferButton>
              )}
            </HStack>
          </Skeleton>
          <Skeleton isLoaded={!loading}>
            <Box
              height="1.3em"
              overflow="hidden"
              display="block"
              textOverflow="ellipsis"
            >
              <Text color="gray" fontSize="xs" fontWeight="semibold">
                {formatDistance(new Date(offer?.startTime || 0), Date.now(), {
                  includeSeconds: false,
                  addSuffix: true,
                })}
                {" • Expires "}
                {formatDistance(new Date(offer?.endTime || 0), Date.now(), {
                  includeSeconds: false,
                  addSuffix: true,
                })}
              </Text>
            </Box>
          </Skeleton>
        </VStack>
      </HStack>
      <VStack spacing={0} fontWeight="semibold" alignItems="end">
        <Skeleton isLoaded={!loading}>
          <Text>
            {offer?.offerPrice}&nbsp;{offer?.paymentToken.symbol}
          </Text>
        </Skeleton>
        <Skeleton isLoaded={!loading && !isPriceAsUsdLoading}>
          <Text color="gray" fontSize="xs">
            <>
              {prefix}
              {numeralFormat(priceAsUsd * Number(offer?.offerPrice))}
            </>
          </Text>
        </Skeleton>
      </VStack>
    </HStack>
  );
}
