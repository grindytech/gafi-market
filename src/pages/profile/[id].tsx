import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Profile from "../../components/profile/Profile";
import configs from "../../configs";
import { UserDto } from "../../services/types/dtos/UserDto";
import { getUserName } from "../../utils/utils";

export default function ProfileId({ account }: { account: UserDto }) {
  return (
    <>
      <NextSeo
        title={`${getUserName(account)} | Overmint Marketplace`}
        description={`${getUserName(account)} | Overmint Marketplace`}
        openGraph={{
          images: [
            {
              url: account?.cover || account?.avatar || "/og.png",
            },
          ],
        }}
      />
      <Profile account={account} />
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<any> {
  const id = context.params.id;
  const account = (
    await axios.get(`${configs.API_URL}/market/api/profile/${id}`)
  ).data;
  return {
    props: { account: account.data },
  };
}
