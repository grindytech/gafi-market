import { useCallback, useState } from "react";
import ImageView from "react-simple-image-viewer";
import { Images } from "../../../images";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { getUrl } from "../../../utils/utils";
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
    <>
      <ImageWithFallback
        cursor="pointer"
        onClick={openImageViewer}
        w="100%"
        h="100%"
        objectFit="contain"
        src={getUrl(nft.image, 1000)}
      />
      {isViewerOpen && (
        <ImageView
          backgroundStyle={{
            zIndex: 100,
          }}
          src={[getUrl(nft.image, 1000)]}
          currentIndex={0}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
    </>
  );
}
