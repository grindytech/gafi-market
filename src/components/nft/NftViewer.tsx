import { Box, Image } from "@chakra-ui/react";
import React from "react";
import ReactPlayer from "react-player";
import { Images } from "../../images";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import ImageViewer from "./viewer/ImageViewer";

function VideoViewer({ nft }: { nft: NftDto }) {
  return (
    <Box position="relative">
      <ReactPlayer
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
        url={nft.animation_url}
        width="100%"
        height="100%"
      />
    </Box>
  );
}

function GLBViewer({ nft }: { nft: NftDto }) {
  return <></>;
}

function IframeEmbedded({ nft }: { nft: NftDto }) {
  return <></>;
}
// "image" | "video" | "glb" | "iframe";
const Viewers = {
  image: ImageViewer,
  video: VideoViewer,
  glb: GLBViewer,
  iframe: IframeEmbedded,
};

export default function NftViewer({ nft }: { nft: NftDto }) {
  const viewer = nft.animation_url ? Viewers[nft.animation_url] : Viewers.image;
  return (
    <Box w="full" h="full">
      {React.cloneElement(viewer({ nft: nft }))}
    </Box>
  );
}
