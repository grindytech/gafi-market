import { Box, Heading, HStack, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "react-query";
import nftService from "../../services/nft.service";
import { HistoryType } from "../../services/types/enum";
import ScrollSlide from "../hScroll/ScrollSlide";
import NftCardRecentlySold from "../nftcard/NftCardRecentlySold";

export default function RecentlySold() {
  const { data } = useQuery(["RecentlySold"], async () => {
    const rs = await nftService.getHistories({
      type: [HistoryType.Sale],
      orderBy: "createdAt",
      desc: "desc",
    });
    return rs.data;
  });
  return (
    data?.items &&
    data?.items.length > 0 && (
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
                <>Recently Sold&nbsp;</>
              </HStack>
            </HStack>
          </Heading>
        </HStack>
        <Box w="full" position="relative">
          <ScrollSlide>
            {data?.items.map((item, k) => (
              <Link
                key={`nft-sold-${item.id}`}
                href={`/nft/${item.nftContract}:${item.tokenId}`}
              >
                <Box w={250} pr={3} pb={5}>
                  <NftCardRecentlySold history={item} />
                </Box>
              </Link>
            ))}
          </ScrollSlide>
        </Box>
      </VStack>
    )
  );
}
