import { Box, BoxProps, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import useCustomToast from "../../hooks/useCustomToast";
import nftService from "../../services/nft.service";

export default function RefreshMetadataButton({
  nftId,
  children,
  ...rest
}: { nftId: string } & BoxProps) {
  const toast = useCustomToast();
  const [loading, setLoading] = useState(false);
  const refreshMetadata = async () => {
    try {
      setLoading(true);
      await nftService.refreshMetaData(nftId);
      toast.success(
        "This item has been queued for an update! Check back in some minutes."
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box onClick={refreshMetadata} {...rest}>
      {children}
    </Box>
  );
}
