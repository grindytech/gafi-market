import { Box } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import Detail from "../../components/nft/Detail";
import configs from "../../configs";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { getNftImageLink } from "../../utils/utils";

export default function NftDetail({ nft }: { nft: NftDto }) {
  const nftName = nft?.name || "#" + nft?.tokenId;
  return (
    <Box id="main" w="full">
      <NextSeo
        title={`${nftName} | Overmint Marketplace`}
        description={`${nftName} | Overmint Marketplace`}
        openGraph={{
          images: [
            {
              url: getNftImageLink(nft.id, 800),
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
  try {
    const nft = (await axios.get(`${configs.API_URL}/market/api/nft/${id}`))
      .data;
    return {
      props: { nft: nft.data },
    };
  } catch (err) {
    if (err.response.status === 404) {
      return { notFound: true };
    }
    throw err;
  }
}
