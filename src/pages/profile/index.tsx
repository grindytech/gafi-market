import { NextSeo } from "next-seo";
import Profile from "../../components/profile/Profile";
import withAuth from "../../components/withAuth";

function ProfilePage() {
  return (
    <>
      <NextSeo
        title={`User Profile | Overmint Marketplace`}
        description={`User Profile | Overmint Marketplace`}
      />
      <Profile />
    </>
  );
}

export default withAuth(ProfilePage);
