import { Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import AddCollection from "../../../components/collections/AddCollection";
import nftService from "../../../services/nft.service";

export default function CollectionEdit() {
  const router = useRouter();
  const { id } = router.query;
  const { data: collection } = useQuery(
    [],
    async () => {
      const rs = await nftService.getNftCollection(String(id));
      return rs.data;
    },
    {
      enabled: !!id,
    }
  );
  return collection ? (
    <Container maxW='container.sm'>
      <AddCollection title="Edit collection" collection={collection} edit={true} />
    </Container>
  ) : (
    <></>
  );
}
