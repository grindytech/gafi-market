import { Box } from "@chakra-ui/react";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { getNftAnimationLink, getNftImageLink } from "../../../utils/utils";

export default function ModelViewer({ nft }: { nft: NftDto }) {
  return (
    <model-viewer
      alt={nft.name}
      src={getNftAnimationLink(nft.id)}
      poster={getNftImageLink(nft.id, 1000)}
      shadow-intensity="1"
      camera-controls
      touch-action="pan-y"
      generate-schema
      autoPlay
      allowFullScreen
    ></model-viewer>
  );
}
