import {
  Box,
  IconButton,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
// Here we have used react-icons package for the icons
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

export default function ReactSlide({
  children,
  setting,
  height,
  length,
}: {
  children: any;
  setting?: Settings;
  height: string;
  length: number;
}) {
  const settings = setting ?? defaultSettings;

  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = React.useState<Slider | null>(null);

  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  // const top = useBreakpointValue({ base: "90%", md: "50%" });
  // const side = useBreakpointValue({ base: "30%", md: "40px" });
  const top = "50%";
  const side = "5px";

  const [index, setIndex] = useState(0);
  return (
    <Box
      position={"relative"}
      height={height}
      width={"full"}
      overflow={"hidden"}
    >
      <Box position="absolute" top={0} right={0} px={2}>
        <Text color="gray.500" fontSize="sm">
          {index + 1} of {length}
        </Text>
      </Box>
      {/* Left Icon */}
      {index > 0 && length > 0 && (
        <IconButton
          bg={useColorModeValue(
            "rgba(255, 255, 255, 0.7)",
            "rgba(0, 0, 0, 0.2)"
          )}
          aria-label="left-arrow"
          variant="ghost"
          position="absolute"
          left={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={9}
          onClick={() => slider?.slickPrev()}
          rounded="full"
        >
          <FiChevronLeft size="30px" />
        </IconButton>
      )}
      {/* Right Icon */}
      {index < length - 1 && (
        <IconButton
          bg={useColorModeValue(
            "rgba(255, 255, 255, 0.7)",
            "rgba(0, 0, 0, 0.2)"
          )}
          aria-label="right-arrow"
          variant="ghost"
          position="absolute"
          right={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={9}
          onClick={() => slider?.slickNext()}
          rounded="full"
        >
          <FiChevronRight size="30px" />
        </IconButton>
      )}
      {/* Slider */}
      <Slider
        beforeChange={(oldIndex, newIndex) => {
          setIndex(newIndex);
        }}
        {...settings}
        ref={(slider) => setSlider(slider)}
      >
        {children}
      </Slider>
    </Box>
  );
}
