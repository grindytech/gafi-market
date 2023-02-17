import { Container } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import AddGame from "../../../components/game/AddGame";
import configs from "../../../configs";
import { GameDto } from "../../../services/types/dtos/GameDto";

export default function GameEdit({ game }: { game: GameDto }) {
  return game ? (
    <Container maxW="container.sm">
      <NextSeo
        title={`Edit ${game.name} | Overmint Marketplace`}
        description={`Edit ${game.name} | Overmint Marketplace`}
        openGraph={{
          images: [
            {
              url: game.featuredImage || game.cover,
            },
          ],
        }}
      />
      <AddGame
        key={`${game.id}-${game.updatedAt}`}
        title="Edit game"
        game={game}
        edit={true}
      />
    </Container>
  ) : (
    <></>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<any> {
  const id = context.params.id;
  const game = (await axios.get(`${configs.API_URL}/market/api/games/${id}`))
    .data;
  return {
    props: { game: game.data },
  };
}
