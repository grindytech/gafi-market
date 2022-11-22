import {
  Box,
  Heading,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
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
}: {
  children: any;
  setting?: Settings;
  height: string;
  title?: any;
}) {
  const settings = setting ?? defaultSettings;

  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = React.useState<Slider | null>(null);

  return (
    <Box
      position={"relative"}
      height={height}
      width={"full"}
      overflow={"hidden"}
    >
      <HStack
        mb={3}
        w="full"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
          {title}
        </Heading>
        <HStack>
          {/* Left Icon */}
          <IconButton
            aria-label="left-arrow"
            variant="outline"
            borderRadius={50}
            zIndex={2}
            onClick={() => slider?.slickPrev()}
          >
            <FiChevronLeft size="25px" />
          </IconButton>
          {/* Right Icon */}
          <IconButton
            aria-label="right-arrow"
            variant="outline"
            borderRadius={50}
            zIndex={2}
            onClick={() => slider?.slickNext()}
          >
            <FiChevronRight size="25px" />
          </IconButton>
        </HStack>
      </HStack>
      {/* Slider */}
      <Slider
        className={Number(settings.slidesToShow) > 1 ? "multi-slick-list" : ""}
        {...settings}
        ref={(slider) => setSlider(slider)}
      >
        {children}
      </Slider>
    </Box>
  );
}
