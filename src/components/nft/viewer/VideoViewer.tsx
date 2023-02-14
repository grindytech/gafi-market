import { Box } from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { getUrl } from "../../../utils/utils";

export default function VideoViewer({ nft }: { nft: NftDto }) {
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
