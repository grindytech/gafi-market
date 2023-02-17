import { Box } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Detail from "../../components/nft/Detail";
import configs from "../../configs";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { getNftImageLink } from "../../utils/utils";

export default function NftDetail({ nft }: { nft: NftDto }) {
  return (
    <Box id="main" w="full">
      <NextSeo
        title={`${nft.name} | Overmint Marketplace`}
        description={`${nft.name} | Overmint Marketplace`}
        openGraph={{
          images: [
            {
              url: getNftImageLink(nft.image, 800),
            },
          ],
        }}
      />
      <Detail nft={nft} />
    </Box>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<any> {
  const id = context.params.id;
  const nft = (await axios.get(`${configs.API_URL}/market/api/nft/${id}`)).data;
  return {
    props: { nft: nft.data },
  };
}
