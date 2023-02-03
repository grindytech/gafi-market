import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import BundleDetail from "../../components/bundle/BundleDetail";

export default function BundleDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Box id="main" w="full">
      <BundleDetail id={id as string} />
    </Box>
  );
}
