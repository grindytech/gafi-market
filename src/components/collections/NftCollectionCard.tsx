import {
  Box,
  Heading,
  HStack,
  Icon,
  Tag,
  Text,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { HiBadgeCheck } from "react-icons/hi";
import Icons from "../../images";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import { Status } from "../../services/types/enum";
import useCustomColors from "../../theme/useCustomColors";
import Avatar from "../Avatar";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import FloatIconWithText from "../FloatIconWithText";
import { ImageWithFallback } from "../LazyImage";
import Skeleton from "../Skeleton";

export default function NftCollectionCard({
  top,
  floor,
  vol,
  collection,
  isLoading,
}: {
  top?: number;
  collection?: NftCollectionDto;
  floor?: number;
  vol?: number;
  isLoading?: boolean;
}) {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");
  const { borderColor } = useCustomColors();
  return (
    <Box w="full" h="full">
      <Card
        h="full"
        w="full"
        p={1}
        __css={cardStyles}
        border="1px solid"
        borderColor={borderColor}
      >
        <CardBody w="full">
          <VStack spacing={0} pb={1} w="full">
            <Box
              pos={"relative"}
              overflow="hidden"
              rounded="xl"
              w="full"
              paddingTop="75%"
              maxW="full"
            >
              <Skeleton isLoaded={!isLoading}>
                <Box position="absolute" w="full" h="full" top={0} left={0}>
                  <ImageWithFallback
                    data-component-name="NFTImage"
                    __css={imageStyles}
                    h="full"
                    w="full"
                    src={collection?.featuredImage || collection?.cover}
                  />
                  <Box zIndex={2} p={1} position="absolute" top={0} left={0}>
                    <FloatIconWithText
                      h={6}
                      w={6}
                      title={collection?.chain.name}
                    >
                      <Icon w={4} h={4}>
                        {Icons.chain[collection?.chain.symbol] ? (
                          Icons.chain[collection?.chain.symbol]()
                        ) : (
                          <></>
                        )}
                      </Icon>
                    </FloatIconWithText>
                  </Box>
                </Box>
              </Skeleton>
            </Box>
            <HStack
              pt={3}
              pb={1}
              px={1}
              justifyContent="space-between"
              position="relative"
              w="full"
            >
              <VStack overflow="hidden" alignItems="start" spacing={0}>
                <Skeleton isLoaded={!isLoading}>
                  <HStack spacing={1}>
                    <Heading fontSize="lg">
                      {collection?.name}{" "}
                      {collection?.status !== Status.Active ? (
                        <Tag>{collection?.status}</Tag>
                      ) : (
                        ""
                      )}
                    </Heading>
                    {collection?.verified && (
                      <Icon color="primary.500" h={4} w={4}>
                        <HiBadgeCheck size="25px" />
                      </Icon>
                    )}
                  </HStack>
                </Skeleton>
                <HStack spacing={1} fontSize="xs" fontWeight="500">
                  {/* <Text>{collection?.key} </Text> */}
                  {vol && (
                    <>
                      <Text color="gray.400">Vol:</Text>
                      <Text color="gray.400">${vol}</Text>
                    </>
                  )}
                  {floor && (
                    <>
                      <Text color="gray.400">Floor:</Text>
                      <Text color="gray.400">${floor}</Text>
                    </>
                  )}
                </HStack>
              </VStack>
              {top && (
                <Box>
                  <Text fontWeight="bold" fontSize="5xl" color="gray.300">
                    {top}
                  </Text>
                </Box>
              )}
            </HStack>
            {!top && (
              <Box w="full" px={1} overflow="hidden">
                <Text
                  textColor="gray.500"
                  w="full"
                  textAlign="left"
                  fontSize="sm"
                  noOfLines={2}
                  height="3em"
                >
                  {collection?.description}
                </Text>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
