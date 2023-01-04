import { Box, Heading, HStack, useStyleConfig, VStack } from "@chakra-ui/react";
import GameCard from "../game/GameCard";
import ScrollSlide from "../hScroll/ScrollSlide";
export default function FeaturedGames() {
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
              <>Featured Games&nbsp;</>
              {/* <Icon w={7} h={7}>
                <Icons.Fire />
              </Icon> */}
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
          <GameCard />
          <GameCard />
          <GameCard />
          <GameCard />
          <GameCard />
          <GameCard />
          <GameCard />
        </ScrollSlide>
      </Box>
    </VStack>
  );
}
