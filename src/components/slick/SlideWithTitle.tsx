import {
  Box,
  Heading,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
  useStyleConfig,
} from "@chakra-ui/react";
import React, { useState } from "react";
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// And react-slick as our Carousel Lib
import Slider, { Settings } from "react-slick";

// Settings for the slider
const defaultSettings: Settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function SlideWithTitle({
  children,
  setting,
  height,
  title,
  length,
}: {
  children: any;
  setting?: Settings;
  height: string;
  title?: any;
  length: number;
}) {
  const settings = setting ?? defaultSettings;
  const top = useBreakpointValue({ base: "50%", md: "50%" });
  const side = useBreakpointValue({ base: "-10px", md: "-10px" });
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = React.useState<Slider | null>(null);
  const sliderBox = useStyleConfig("SliderBox");
  const [index, setIndex] = useState(0);

  return (
    <Box
      position={"relative"}
      height={height}
      width={"full"}
      overflow={"visible"}
      __css={sliderBox}
    >
      <HStack
        mb={3}
        w="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading w="full" fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
          {title}
        </Heading>
      </HStack>
      {index > 0 && length > 0 && (
        <IconButton
          data-component-name="arrow"
          aria-label="left-arrow"
          variant="ghost"
          position="absolute"
          left={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={2}
          onClick={() => slider?.slickPrev()}
          borderRadius="xl"
          colorScheme="gray"
          bg="gray.700"
          color="white"
          _hover={{
            bg: "gray.500",
          }}
        >
          <FiChevronLeft size="30px" />
        </IconButton>
      )}
      {index < length - 1 && (
        <IconButton
          data-component-name="arrow"
          aria-label="right-arrow"
          variant="ghost"
          position="absolute"
          right={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={2}
          onClick={() => slider?.slickNext()}
          borderRadius="xl"
          colorScheme="gray"
          bg="gray.700"
          color="white"
          _hover={{
            bg: "gray.500",
          }}
        >
          <FiChevronRight size="30px" />
        </IconButton>
      )}
      {/* Slider */}
      <Slider
        beforeChange={(oldIndex, newIndex) => {
          setIndex(newIndex);
        }}
        className={Number(settings.slidesToShow) > 1 ? "multi-slick-list" : ""}
        {...settings}
        ref={(slider) => setSlider(slider)}
      >
        {children}
      </Slider>
    </Box>
  );
}
