import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Game from "../../components/game/Game";
import configs from "../../configs";
import { GameDto } from "../../services/types/dtos/GameDto";

export default function GameDetailPage({ game }: { game: GameDto }) {
  return (
    <>
      <NextSeo
        title={`${game.name} | Overmint Marketplace`}
        description={`${game.name} | Overmint Marketplace`}
        openGraph={{
          images: [
            {
              url: game.featuredImage || game.cover,
            },
          ],
        }}
      />
      <Game game={game} />
    </>
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
