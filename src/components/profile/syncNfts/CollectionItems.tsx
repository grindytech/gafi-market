import {
  Box,
  HStack,
  Icon,
  Text,
  Tooltip,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import Icons from "../../../images";
import { NftCollectionDto } from "../../../services/types/dtos/NftCollectionDto";
import useCustomColors from "../../../theme/useCustomColors";
import Avatar from "../../Avatar";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import Skeleton from "../../Skeleton";

export default function CollectionItems({
  loading,
  collection,
  active,
}: {
  collection?: NftCollectionDto;
  loading?: boolean;
  active?: boolean;
}) {
  const cardStyles = useStyleConfig("NFTCard");
  const { borderColor } = useCustomColors();

  return (
    <Box w="full" h="full">
      <Card
        className={active ? "active" : ""}
        h="full"
        w="full"
        p={1}
        __css={cardStyles}
        border="1px solid"
        borderColor={borderColor}
      >
        <CardBody w="full">
          <HStack w="full">
            <Skeleton isLoaded={!loading}>
              <Avatar
                jazzicon={{
                  diameter: 30,
                  seed: collection?.nftContract || "",
                }}
                src={collection?.avatar}
              />
            </Skeleton>
            <VStack w="full" spacing={0} alignItems="start">
              <HStack w="full" justifyContent="space-between">
                <Skeleton isLoaded={!loading}>
                  <Text minW={200}>{collection?.name}</Text>
                </Skeleton>
                <Tooltip label={collection?.chain?.name}>
                  <Icon blur="xl" w={5} h={5}>
                    {Icons.chain[
                      String(collection?.chain?.symbol).toUpperCase()
                    ]
                      ? Icons.chain[
                          String(collection?.chain?.symbol).toUpperCase()
                        ]()
                      : ""}
                  </Icon>
                </Tooltip>
              </HStack>
              <Skeleton isLoaded={!loading}>
                <Text minW={200} color="gray.500" fontSize="sm">
                  {collection?.key || "--"}
                </Text>
              </Skeleton>
            </VStack>
          </HStack>
        </CardBody>
      </Card>
    </Box>
  );
}
