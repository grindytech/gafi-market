import {
  Box,
  Fade,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/profileSlice";
import PrimaryButton from "../PrimaryButton";
import NftCard from "./NftCard";
import NextLink from "next/link";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import Skeleton from "../Skeleton";
import Icons from "../../images";

export default function NftCardMarket({
  nft,
  loading,
}: {
  nft?: NftDto;
  loading?: boolean;
}) {
  const { user } = useSelector(selectProfile);
  return (
    <NftCard
      loading={loading}
      image={nft?.image}
      showOnHover={
        <VStack
          w="full"
          h="full"
          justifyContent="space-between"
          alignItems="start"
          zIndex={3}
        >
          <Box></Box>
          <HStack w="full" justifyContent="center" p={2}>
            <Fade in={true}>
              {!nft?.sale ? (
                <HStack>
                  <PrimaryButton>Make offer</PrimaryButton>
                </HStack>
              ) : user === nft?.owner.address ? (
                <HStack>
                  <PrimaryButton
                    colorScheme="red"
                    bg="red.600"
                    _hover={{ bg: "red.500" }}
                  >
                    Cancel
                  </PrimaryButton>
                </HStack>
              ) : (
                <HStack>
                  <PrimaryButton>Buy now</PrimaryButton>
                  <IconButton aria-label="Add to cart">
                    <FiPlus size="30px" />
                  </IconButton>
                </HStack>
              )}
            </Fade>
          </HStack>
        </VStack>
      }
    >
      <VStack w="full" alignItems="start" p={3} spacing={2}>
        <VStack p={1} w="full" alignItems="start" spacing={0}>
          <Skeleton minW={100} height="1em" isLoaded={!loading}>
            <NextLink href="#">
              <Text
                _hover={{
                  textDecoration: "underline",
                }}
                color="primary.50"
                fontSize="sm"
                fontWeight="semibold"
              >
                {nft?.nftCollection.name}{" "}
                {nft?.nftCollection.verified && (
                  <Icon color="primary.50" h={4} w={4}>
                    <HiBadgeCheck size="25px" />
                  </Icon>
                )}
              </Text>
            </NextLink>
          </Skeleton>
          <Skeleton w='full' isLoaded={!loading}>
            <HStack w="full" justifyContent="space-between">
              <Text fontSize="md" fontWeight="semibold">
                {nft?.name}
              </Text>
              <Icon blur='xl' w={5} h={5}>
                {Icons.chain[String(nft?.chain?.symbol).toUpperCase()]
                  ? Icons.chain[String(nft?.chain?.symbol).toUpperCase()]()
                  : ""}
              </Icon>
            </HStack>
          </Skeleton>
        </VStack>
        <HStack
          p={3}
          bg="rgba(100,100,100,0.1)"
          w="full"
          justifyContent="space-between"
          rounded="xl"
        >
          <VStack w="50%" alignItems="start" spacing={0}>
            <Text fontSize="sm" fontWeight="semibold">
              Price
            </Text>
            <Skeleton isLoaded={!loading}>
              <Text color="gray.400">
                {nft?.price > 0
                  ? `${nft?.price} ${nft?.sale.paymentToken.symbol}`
                  : "Not for sale"}
              </Text>
            </Skeleton>
          </VStack>
          <VStack w="50%" alignItems="start" spacing={0}>
            <Text fontSize="sm" fontWeight="semibold">
              Last sold
            </Text>
            <Skeleton isLoaded={!loading}>
              <Text color="gray.400" minW={50}>
                {nft?.lastSold >= 0
                  ? `${nft?.lastSold} ${nft?.lastSoldToken}`
                  : "--"}
              </Text>
            </Skeleton>
          </VStack>
        </HStack>
      </VStack>
    </NftCard>
  );
}
