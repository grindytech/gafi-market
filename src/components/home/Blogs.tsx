import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ScrollSlide from "../hScroll/ScrollSlide";

import { useQuery } from "react-query";
import nftService from "../../services/nft.service";
import useCustomColors from "../../theme/useCustomColors";
import Card from "../card/Card";
import CardBody from "../card/CardBody";
import { ImageWithFallback } from "../LazyImage";
import Skeleton from "../Skeleton";
const IMAGE =
  "https://liquidifty.imgix.net/QmXSgpjF9SdNz3Rjqs6cTKfGaRRE3iupF6W3iYp9CpCCNW?auto=compress,format";
export default function Blogs() {
  const {
    data: rssItems,
    isError,
    isLoading,
  } = useQuery("Blogs", async () => {
    const rs = (await nftService.getFeeds()) as any;
    return rs.items;
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
              <>Blogs&nbsp;</>
            </HStack>
            <Button
              className="right-arrow-btn"
              size="sm"
              rightIcon={<FiArrowRight className="right-arrow-icon" />}
              textTransform="uppercase"
              as={NextLink}
              href="https://blog.heroesempires.com/"
              target="_blank"
            >
              View all
            </Button>
          </HStack>
        </Heading>
      </HStack>
      <Box w="full" position="relative">
        {!isLoading ? (
          <ScrollSlide>
            {rssItems.map((rss) => (
              <NextLink href={rss.link} target={"_blank"} key={rss.title}>
                <Box w={300} pb={5} mr={4}>
                  <Blog
                    content={rss["content:encodedSnippet"]}
                    image={rss.enclosure?.url}
                    isLoading={false}
                    title={rss.title}
                  />
                </Box>
              </NextLink>
            ))}
          </ScrollSlide>
        ) : (
          <HStack overflow="auto" w="full">
            {Array.from(Array(6).keys()).map((k, i) => (
              <Blog key={`blog-skeleton-${i}`} isLoading />
            ))}
          </HStack>
        )}
      </Box>
    </VStack>
  );
}

function Blog({
  content,
  image,
  title,
  isLoading,
}: {
  title?: string;
  content?: string;
  image?: string;
  isLoading?: boolean;
}) {
  const { borderColor } = useCustomColors();

  return (
    <Card
      _hover={{
        boxShadow: "md",
        borderColor: "primary.300",
      }}
      p={0}
      rounded="xl"
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
    >
      <CardBody p={0} m={0}>
        <VStack w="full" p={3}>
          <Skeleton isLoaded={!isLoading}>
            <Box
              pos={"relative"}
              overflow="hidden"
              bg={useColorModeValue("gray.600", "gray.800")}
              rounded="xl"
              w={272}
              h={178}
              maxW="full"
              border={"1px solid"}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <ImageWithFallback
                h="full"
                w="full"
                src={image}
                objectFit="fill"
              />
            </Box>
          </Skeleton>
          <VStack w="full" overflow="hidden" alignItems="start">
            <Skeleton isLoaded={!isLoading}>
              <Text
                title={title}
                noOfLines={2}
                fontSize="lg"
                fontWeight="semibold"
                h="3em"
              >
                {title}
              </Text>
            </Skeleton>
            <Skeleton w="full" isLoaded={!isLoading}>
              <Text h="4.5em" w="full" fontSize="md" noOfLines={3}>
                {content}
              </Text>
            </Skeleton>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
