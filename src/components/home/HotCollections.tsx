import { Button, HStack, Icon, Image } from "@chakra-ui/react";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import Icons from "../../images";
import NftCollectionCard from "../NftCollectionCard";
import SlideWithTitle from "../slick/SlideWithTitle";
import NextLink from "next/link";
export default function HotCollections() {
  return (
    <SlideWithTitle
      length={2}
      title={
        <HStack justifyContent="space-between" w="full">
          <HStack alignItems="center">
            <>Top Collections&nbsp;</>
            <Icon w={7} h={7}>
              <Icons.Fire />
            </Icon>
          </HStack>
          <Button
            className="right-arrow-btn"
            size="sm"
            rightIcon={<FiArrowRight className="right-arrow-icon" />}
            textTransform="uppercase"
            as={NextLink}
            href="/nft-collection"
          >
            View all
          </Button>
        </HStack>
      }
      height="auto"
      setting={{
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        responsive: [
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            },
          },
          {
            breakpoint: 832,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
        ],
      }}
    >
      <NftCollectionCard />
      <NftCollectionCard />
      <NftCollectionCard />
      <NftCollectionCard />
      <NftCollectionCard />
      <NftCollectionCard />
      <NftCollectionCard />
    </SlideWithTitle>
  );
}
