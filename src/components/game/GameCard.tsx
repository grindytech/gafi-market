import {
  Box,
  Heading,
  HStack,
  Icon,
  Tag,
  Text,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import { HiBadgeCheck } from "react-icons/hi";
import { GameDto } from "../../services/types/dtos/GameDto";
import { Status } from "../../services/types/enum";
import useCustomColors from "../../theme/useCustomColors";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import { ImageWithFallback } from "../LazyImage";
import Skeleton from "../Skeleton";

export default function GameCard({
  game,
  isLoading,
}: {
  game?: GameDto;
  isLoading?: boolean;
}) {
  const cardStyles = useStyleConfig("NFTCard");
  const imageStyles = useStyleConfig("NFTCardImage");
  const { cardBg } = useCustomColors();

  return (
    <Box w="full" h="full">
      <Card
        h="full"
        w="full"
        p={0}
        __css={cardStyles}
        borderColor={cardBg}
        bg={cardBg}
      >
        <CardBody w="full">
          <VStack spacing={0} pb={1} w="full">
            <Box
              pos={"relative"}
              overflow="hidden"
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
                    src={game?.featuredImage || game?.cover}
                  />
                  <Box zIndex={2} p={1} position="absolute" top={0} left={0}>
                    {/* <FloatIconWithText
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
                    </FloatIconWithText> */}
                  </Box>
                </Box>
              </Skeleton>
            </Box>
            <HStack
              p={2}
              justifyContent="space-between"
              position="relative"
              w="full"
            >
              <VStack overflow="hidden" alignItems="start" spacing={0}>
                <Skeleton isLoaded={!isLoading}>
                  <HStack spacing={1}>
                    <Heading fontSize="lg">
                      {game?.name}&nbsp;
                      {game?.status !== Status.Active ? (
                        <Tag>{game?.status}</Tag>
                      ) : (
                        ""
                      )}
                    </Heading>
                    {game?.verified && (
                      <Icon color="primary.500" h={4} w={4}>
                        <HiBadgeCheck size="25px" />
                      </Icon>
                    )}
                  </HStack>
                </Skeleton>
              </VStack>
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
                  {game?.description}
                </Text>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
