import {
  Box,
  HStack,
  Icon,
  Text,
  Tooltip,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { get } from "lodash";
import NextLink from "next/link";
import { HiBadgeCheck } from "react-icons/hi";
import { Settings } from "react-slick";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import { useTokenUSDPrice } from "../../hooks/useTokenUSDPrice";
import Icons from "../../images";
import { BundleDto } from "../../services/types/dtos/BundleDto";
import { getUrl, numeralFormat } from "../../utils/utils";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import CardHeader from "../card/CardHeader";
import { MASKS } from "../nftcard/mask";
import NftCard from "../nftcard/NftCard";
import ReactSlide from "../slick/ReactSlide";

const settings: Settings = {
  dots: false,
  arrows: false,
  fade: true,
  infinite: false,
  autoplay: false,
  slidesToShow: 1,
  slidesToScroll: 1,
};
export default function BundleCard({ bundle }: { bundle: BundleDto }) {
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: bundle?.nftCollection,
  });
  const { chainInfo } = useGetChainInfo({
    chainId: bundle?.chain,
  });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: bundle.paymentToken,
  });
  const cardStyles = useStyleConfig("NFTCard");
  const mask = get(MASKS, collectionInfo?.key);
  const { isPriceAsUsdLoading, prefix, priceAsUsd } = useTokenUSDPrice({
    enabled: !!bundle.price,
    paymentSymbol: paymentInfo?.symbol,
  });
  return (
    <Card
      w="full"
      __css={cardStyles}
      bg={useColorModeValue("white", "gray.800")}
      p={0}
    >
      <CardHeader p={2}>
        <VStack w="full" spacing={0} alignItems="start">
          <NextLink target="_blank" href={`/collection/${collectionInfo?.key}`}>
            <HStack spacing={0}>
              <Box>
                <Text
                  noOfLines={1}
                  _hover={{
                    textDecoration: "underline",
                  }}
                  color="primary.50"
                  fontSize="sm"
                  fontWeight="semibold"
                  textOverflow="ellipsis"
                >
                  {collectionInfo?.name}
                </Text>
              </Box>
              {collectionInfo?.verified && (
                <Icon color="primary.50" h={4} w={4}>
                  <HiBadgeCheck size="25px" />
                </Icon>
              )}
            </HStack>
          </NextLink>
          <Text>{bundle?.name || `${collectionInfo?.name} bundle`}</Text>
        </VStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={0} w="full">
          <ReactSlide
            height="auto"
            length={bundle?.items.length}
            setting={settings}
          >
            {bundle?.items.map((nft) => (
              <Box key={nft.id}>
                <NftCard
                  mask={mask ? mask({ nft: nft }) : <></>}
                  cardStyle="unstyle"
                  image={getUrl(nft.image, 600)}
                >
                  <VStack p={2} spacing={0} alignItems="start" w="full">
                    <HStack w="full" justifyContent="space-between">
                      <Text noOfLines={1} fontSize="md" fontWeight="semibold">
                        {nft?.name || <>&nbsp;</>}
                      </Text>
                      <Tooltip label={chainInfo?.name}>
                        <Icon blur="xl" w={5} h={5}>
                          {Icons.chain[String(chainInfo?.symbol).toUpperCase()]
                            ? Icons.chain[
                                String(chainInfo?.symbol).toUpperCase()
                              ]()
                            : ""}
                        </Icon>
                      </Tooltip>
                    </HStack>
                    <Text
                      noOfLines={1}
                      color="gray"
                      fontSize="xs"
                      fontWeight="semibold"
                    >
                      #{nft?.tokenId}
                    </Text>
                  </VStack>
                </NftCard>
              </Box>
            ))}
          </ReactSlide>
          <Box p={2} w="full">
            <VStack
              p={3}
              bg="rgba(100,100,100,0.1)"
              w="full"
              rounded="xl"
              alignItems="start"
              spacing={0}
            >
              <Text fontSize="sm" fontWeight="semibold">
                Price
              </Text>
              <HStack w="full" alignItems="end">
                <Text
                  fontWeight="semibold"
                  noOfLines={1}
                  fontSize="sm"
                  color="gray"
                  title={String(
                    bundle?.price > 0
                      ? `${bundle.price} ${paymentInfo?.symbol}`
                      : ""
                  )}
                >
                  {bundle?.price > 0
                    ? `${numeralFormat(bundle?.price)} ${paymentInfo?.symbol}`
                    : "Not for sale"}
                </Text>
                {bundle?.price && priceAsUsd && (
                  <Text
                    fontWeight="semibold"
                    noOfLines={1}
                    fontSize="xs"
                    color="gray.500"
                    textAlign="left"
                    title={`${prefix}${bundle.price * priceAsUsd}`}
                  >
                    ~{prefix}
                    {numeralFormat(bundle.price * priceAsUsd)}
                  </Text>
                )}
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}
