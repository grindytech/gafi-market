import { Image } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { Images } from "../../../images";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import ImageView from "react-simple-image-viewer";

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
      <Image
        cursor="pointer"
        onClick={openImageViewer}
        fallbackSrc={Images.Placeholder.src}
        w="100%"
        h="100%"
        objectFit="contain"
        src={nft.image}
      />
      {isViewerOpen && (
        <ImageView
          backgroundStyle={{
            zIndex: 100,
          }}
          src={[nft.image]}
          currentIndex={0}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
    </>
  );
}
