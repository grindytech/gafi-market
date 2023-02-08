import {
  Box,
  Heading,
  HStack,
  Icon,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "react-query";
import Icons from "../../images";
import nftService from "../../services/nft.service";
import NftCollectionCard from "../collections/NftCollectionCard";
import ScrollSlide from "../hScroll/ScrollSlide";
export default function HotCollections() {
  const sliderBox = useStyleConfig("SliderBox");
  const { data } = useQuery(["HotCollections"], async () => {
    const rs = await nftService.topCollections({});
    return rs.data;
  });
  return (
    <VStack w="full">
      <HStack
        mb={3}
        w="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading w="full" fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
          <HStack justifyContent="space-between" w="full">
            <HStack alignItems="center">
              <>Top Collections&nbsp;</>
              <Icon w={7} h={7}>
                <Icons.Fire />
              </Icon>
            </HStack>
          </HStack>
        </Heading>
      </HStack>
      <Box w="full" position="relative" __css={sliderBox}>
        <ScrollSlide>
          {data?.items.map((c, k) => (
            <Box py={3} pr={3}>
              <Link
                href={`/collection/${c.nftCollectionInfo.key}`}
                key={`TopCollection-${c.nftCollectionInfo.id}`}
              >
                <Box w="350px" maxW="80vw">
                  <NftCollectionCard
                    collection={c.nftCollectionInfo}
                    floor={c.floorPrice}
                    vol={c.totalVol}
                    top={k + 1}
                  />
                </Box>
              </Link>
            </Box>
          ))}
        </ScrollSlide>
      </Box>
    </VStack>
  );
}
