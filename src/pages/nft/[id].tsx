import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Detail from "../../components/nft/Detail";

export default function NftDetail() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Box id="main" w="full">
      <Detail id={id as string} />
    </Box>
  );
}
