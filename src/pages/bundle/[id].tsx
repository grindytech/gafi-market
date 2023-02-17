import { Box } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import BundleDetail from "../../components/bundle/BundleDetail";
import configs from "../../configs";
import { BundleDto } from "../../services/types/dtos/BundleDto";
import { convertIpfsLink, getNftImageLink } from "../../utils/utils";

export default function BundleDetailPage({ bundle }: { bundle: BundleDto }) {
  return (
    <Box id="main" w="full">
      <NextSeo
        title={`Bundle ${bundle.name} | Overmint Marketplace`}
        description={`Bundle ${bundle.name} | Overmint Marketplace`}
        openGraph={{
          images: bundle.items.map((nft) => ({
            url: convertIpfsLink(nft.image),
          })),
        }}
      />
      <BundleDetail bundle={bundle} />
    </Box>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<any> {
  const id = context.params.id;
  const bundle = (
    await axios.get(`${configs.API_URL}/market/api/bundles/${id}/detail`)
  ).data;
  return {
    props: { bundle: bundle.data },
  };
}
