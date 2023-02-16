import { Box } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import ImageView from "react-simple-image-viewer";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { getNftImageLink } from "../../../utils/utils";
import { ImageWithFallback } from "../../LazyImage";

export default function ImageViewer({ nft }: { nft: NftDto }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const openImageViewer = useCallback((index) => {
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
  return (
    <Box overflow="hidden" rounded="lg" p={2} >
      <ImageWithFallback
        overflow="hidden"
        rounded="lg"
        cursor="pointer"
        onClick={openImageViewer}
        objectFit="contain"
        src={getNftImageLink(nft.id, 1000)}
      />
      {isViewerOpen && (
        <ImageView
          backgroundStyle={{
            zIndex: 100,
          }}
          src={[getNftImageLink(nft.id, 1000)]}
          currentIndex={0}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
    </Box>
  );
}
