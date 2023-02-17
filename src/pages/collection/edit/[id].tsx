import { Container } from "@chakra-ui/react";
import axios from "axios";
import { NextSeo } from "next-seo";
import AddCollection from "../../../components/collections/AddCollection";
import configs from "../../../configs";
import { NftCollectionDto } from "../../../services/types/dtos/NftCollectionDto";

export default function CollectionEdit({
  collection,
}: {
  collection: NftCollectionDto;
}) {
  return (
    <Container maxW="container.sm">
      <NextSeo
        title={`Edit ${collection.name} | Overmint Marketplace`}
        description={`Edit ${collection.name} | Overmint Marketplace`}
        openGraph={{
          images: [
            {
              url: collection.featuredImage || collection.cover,
            },
          ],
        }}
      />
      <AddCollection
        key={`${collection.id}-${collection.updatedAt}`}
        title="Edit collection"
        collection={collection}
        edit={true}
      />
    </Container>
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
