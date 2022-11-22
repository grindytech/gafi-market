import { HStack, Image } from "@chakra-ui/react";
import React from "react";
import Icons from "../../images";
import NftCollectionCard from "../NftCollectionCard";
import SlideWithTitle from "../SlideWithTitle";
export default function HotCollections() {
  return (
    <SlideWithTitle
      title={
        <HStack alignItems="center">
          <>Hot Collections&nbsp;</>
          <Image src={Icons.Fire.src} w={7} h={7} />
        </HStack>
      }
      height="auto"
      setting={{
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
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
