import { useRouter } from "next/router";
import Detail from "../../components/nft/Detail";

export default function NftDetail() {
  const router = useRouter();
  const { id } = router.query;
  return <Detail id={id as string} />;
}
