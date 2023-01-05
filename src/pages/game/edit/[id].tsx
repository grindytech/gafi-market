import { Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import AddGame from "../../../components/game/AddGame";
import nftService from "../../../services/nft.service";

export default function GameEdit() {
  const router = useRouter();
  const { id } = router.query;
  const { data: game, refetch } = useQuery(
    [],
    async () => {
      const rs = await nftService.getGame(String(id));
      return rs.data;
    },
    {
      enabled: !!id,
    }
  );
  return game ? (
    <Container maxW="container.sm">
      <AddGame
        key={`${game.id}-${game.updatedAt}`}
        title="Edit game"
        onSuccess={() => {
          refetch();
        }}
        game={game}
        edit={true}
      />
    </Container>
  ) : (
    <></>
  );
}
