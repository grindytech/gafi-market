import axios from "axios";
import { NextSeo } from "next-seo";
import Collection from "../../components/collections/Collection";
import configs from "../../configs";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";

export default function CollectionDetail({
  collection,
}: {
  collection: NftCollectionDto;
}) {
  return (
    <>
      <NextSeo
        title={`${collection.name} | Overmint Marketplace`}
        description={`${collection.name} | Overmint Marketplace`}
        openGraph={{
          images: [
            {
              url: collection.featuredImage || collection.cover,
            },
          ],
        }}
      />
      <Collection collection={collection} />
    </>
  );
}

export async function getServerSideProps(context: any): Promise<any> {
  const id = context.params.id;
  const collection = (
    await axios.get(`${configs.API_URL}/market/api/nftcollections/${id}`)
  ).data;
  return {
    props: { collection: collection.data },
  };
}
