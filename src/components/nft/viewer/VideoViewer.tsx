import { Box } from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { getNftAnimationLink } from "../../../utils/utils";

export default function VideoViewer({ nft }: { nft: NftDto }) {
  return (
    <Box overflow="hidden" w="full" h="full" position="relative">
      <ReactPlayer
        url={getNftAnimationLink(nft.id)}
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
