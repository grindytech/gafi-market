import { Box, Image } from "@chakra-ui/react";
import React from "react";
import ReactPlayer from "react-player";
import { Images } from "../../images";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { getUrl } from "../../utils/utils";
import ImageViewer from "./viewer/ImageViewer";

function VideoViewer({ nft }: { nft: NftDto }) {
  return (
    <Box w="full" h="full" position="relative">
      <ReactPlayer
        url={getUrl(nft.animationUrl)}
        width="100%"
        height="100%"
        controls={true}
        loop={true}
        volume={0}
        playing={true}
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
  model: GLBViewer,
  html: IframeEmbedded,
};

export default function NftViewer({ nft }: { nft: NftDto }) {
  const type = nft?.animationPlayType
    ? nft?.animationPlayType?.includes("image")
      ? "image"
      : nft.animationPlayType.includes("model")
      ? "model"
      : nft.animationPlayType.includes("video")
      ? "video"
      : nft.animationPlayType.includes("audio")
      ? "audio"
      : "html"
    : "";
  const viewer = Viewers[type] || Viewers.image;
  return (
    <Box w="full" h="full">
      {React.cloneElement(viewer({ nft: nft }))}
    </Box>
  );
}
