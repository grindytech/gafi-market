import { NftDto } from "../../../services/types/dtos/Nft.dto";
import { getUrl } from "../../../utils/utils";

export default function ModelViewer({ nft }: { nft: NftDto }) {
  return (
    <model-viewer
      alt={nft.name}
      src={getUrl(nft.animationUrl)}
      poster={getUrl(nft.image, 1000)}
      shadow-intensity="1"
      camera-controls
      touch-action="pan-y"
      generate-schema
      autoPlay
      allowFullScreen
    ></model-viewer>
  );
}
