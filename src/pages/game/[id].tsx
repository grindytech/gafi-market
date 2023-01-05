import { useRouter } from "next/router";
import Game from "../../components/game/Game";

export default function GameDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  return <Game id={id as string} />;
}
