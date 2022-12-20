import Profile from "../../components/profile/Profile";
import withAuth from "../../components/withAuth";

function ProfilePage() {
  return <Profile />;
}

export default withAuth(ProfilePage);
