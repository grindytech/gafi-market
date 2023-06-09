import { NftDto } from "../../../services/types/dtos/Nft.dto";
import Iframe from "react-iframe";
import { Box } from "@chakra-ui/react";
export default function IframeEmbedded({ nft }: { nft: NftDto }) {
  return (
    <Iframe
      url={nft.animationUrl}
      width="100%"
      height="400px"
      id=""
      className=""
      display="block"
      position="relative"
    />
  );
}
