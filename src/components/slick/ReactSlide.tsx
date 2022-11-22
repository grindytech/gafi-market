import { Box, IconButton, useBreakpointValue } from "@chakra-ui/react";
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
  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });
  const [index, setIndex] = useState(0);
  return (
    <Box
      position={"relative"}
      height={height}
      width={"full"}
      overflow={"hidden"}
    >
      {/* Left Icon */}
      {index > 0 && length > 0 && (
        <IconButton
          aria-label="left-arrow"
          variant="ghost"
          position="absolute"
          left={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={2}
          onClick={() => slider?.slickPrev()}
          borderRadius={50}
        >
          <FiChevronLeft size="30px" />
        </IconButton>
      )}
      {/* Right Icon */}
      {index < length - 1 && (
        <IconButton
          aria-label="right-arrow"
          variant="ghost"
          position="absolute"
          right={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={2}
          onClick={() => slider?.slickNext()}
          borderRadius={50}
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
