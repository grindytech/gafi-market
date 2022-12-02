import { useRouter } from "next/router";
import Profile from "../../components/profile/Profile";

export default function ProfileId() {
  const router = useRouter();
  const { id } = router.query;
  return <Profile address={id as string} />;
}
