import {
  Box,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { HiBadgeCheck } from "react-icons/hi";
import Icons from "../../images";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
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
    <Box w="full">
      <Card
        w="full"
        p={1}
        __css={cardStyles}
        border="1px solid"
        borderColor={borderColor}
      >
        <CardBody w="full">
          <VStack w="full">
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
                    src={collection?.featureImage || collection?.cover}
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
              py={1}
              justifyContent="space-between"
              position="relative"
              w="full"
            >
              <HStack justifyContent="start">
                {/* <Avatar src={IMAGE} borderColor="primary.200" borderWidth={1} /> */}
                <Skeleton isLoaded={!isLoading}>
                  <Avatar
                    size="sm"
                    borderColor="primary.200"
                    borderWidth={1}
                    jazzicon={{
                      diameter: 30,
                      seed: collection?.nftContract || "",
                    }}
                    src={collection?.avatar}
                  />
                </Skeleton>

                <HStack justifyContent="start" spacing={0} alignItems="center">
                  <VStack alignItems="start" spacing={0}>
                    <Skeleton isLoaded={!isLoading}>
                      <HStack spacing={1}>
                        <Heading fontSize="md">{collection?.name}</Heading>
                        {collection?.verified && (
                          <Icon color="primary.500" h={4} w={4}>
                            <HiBadgeCheck size="25px" />
                          </Icon>
                        )}
                      </HStack>
                    </Skeleton>
                    <HStack fontWeight="500" color="gray.400" fontSize="sm">
                      {vol && (
                        <>
                          <Text>Vol:</Text>
                          <Text>$300m</Text>
                        </>
                      )}
                      {floor && (
                        <>
                          <Text>Floor:</Text>
                          <Text>100HE</Text>
                        </>
                      )}
                    </HStack>
                  </VStack>
                </HStack>
              </HStack>
              {top && (
                <Box px={3}>
                  <Text fontWeight="bold" fontSize="5xl" color="gray.300">
                    {top}
                  </Text>
                </Box>
              )}
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
