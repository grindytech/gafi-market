import { Box } from "@chakra-ui/react";
import React from "react";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import IframeEmbedded from "./IframeEmbedded";
import ImageViewer from "./ImageViewer";
import ModelViewer from "./ModelViewer";
import VideoViewer from "./VideoViewer";

const Viewers = {
  image: ImageViewer,
  video: VideoViewer,
  model: ModelViewer,
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
    <Box
      display="flex"
      justifyContent="center"
      alignContent="center"
      w="full"
      h="full"
    >
      {React.cloneElement(viewer({ nft: nft }))}
    </Box>
  );
}
