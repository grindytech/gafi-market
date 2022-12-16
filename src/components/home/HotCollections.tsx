import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import NextLink from "next/link";
import { FiArrowRight } from "react-icons/fi";
import Icons from "../../images";
import ScrollSlide from "../hScroll/ScrollSlide";
import NftCollectionCard from "../collections/NftCollectionCard";
export default function HotCollections() {
  const sliderBox = useStyleConfig("SliderBox");

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
            {/* <Button
              className="right-arrow-btn"
              size="sm"
              rightIcon={<FiArrowRight className="right-arrow-icon" />}
              textTransform="uppercase"
              as={NextLink}
              href="/games"
            >
              View all
            </Button> */}
          </HStack>
        </Heading>
      </HStack>
      <Box w="full" position="relative" __css={sliderBox}>
        <ScrollSlide>
          {Array.from(Array(12).keys()).map((k) => (
            <Box py={3} pr={3}>
              <Link href="#" key={`TopCollection-${k + 1}`}>
                <Box w="300px" maxW="80vw">
                  <NftCollectionCard top={k + 1} />
                </Box>
              </Link>
            </Box>
          ))}
        </ScrollSlide>
      </Box>
    </VStack>
  );
}
