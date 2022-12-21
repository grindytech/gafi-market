import { useRouter } from "next/router";
import Collection from "../../components/collections/Collection";

export default function CollectionDetail() {
  const router = useRouter();
  const { id } = router.query;
  return <Collection id={id as string} />;
}
