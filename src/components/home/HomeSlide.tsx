import {
  Box,
  Button,
  Container,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
// And react-slick as our Carousel Lib
import ReactSlide from "../slick/ReactSlide";
import React from "react";
import { Settings } from "react-slick";

// Settings for the slider


export default function HomeSlide() {
  const dotColor = useColorModeValue("gray.600", "gray.600");
  const settings: Settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: (index) => {
      return (
        <Link
          borderRadius={5}
          transition="0.2s ease-in"
          display="block"
          w="full"
          h="full"
          bg={dotColor}
        ></Link>
      );
    },
  };
  // This list contains all the data for carousels
  // This can be static or loaded from a server
  const cards = [
    {
      title: "Design Projects 1",
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image:
        "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
    },
    {
      title: "Design Projects 2",
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image:
        "https://images.unsplash.com/photo-1438183972690-6d4658e3290e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2274&q=80",
    },
    {
      title: "Design Projects 3",
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image:
        "https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
    },
  ];

  return (
    <ReactSlide length={-1} height="500px" setting={settings}>
      {cards.map((card, index) => (
        <Box
          key={index}
          height="full"
          position="relative"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          backgroundImage={`url(${card.image})`}
        >
          {/* This is the block you need to change, to customize the caption */}
          <Container size="container.xl" height="500px" position="relative">
            <Stack
              spacing={6}
              w={"full"}
              maxW={"lg"}
              position="absolute"
              top="50%"
              transform="translate(0, -50%)"
            >
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                {card.title}
              </Heading>
              <Text fontSize={{ base: "md", lg: "lg" }} color="GrayText">
                {card.text}
              </Text>
            </Stack>
          </Container>
        </Box>
      ))}
    </ReactSlide>
  );
}
