import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectProfile } from "../store/profileSlice";
import { toFindDuplicates } from "../utils/utils";
import Login from "./Login";

const withAuth = (Component: any, role?: string[]) => {
  const Auth = (props) => {
    const router = useRouter();
    const { isLoggedIn, profile } = useSelector(selectProfile);
    let matchRole = true;
    if (role) {
      if (!profile.roles) matchRole = false;
      else {
        const dup = toFindDuplicates([...role, ...profile.roles]);
        if (dup.length === 0) {
          matchRole = false;
        }
      }
    }
    // If user is not logged in, return login component
    if (!isLoggedIn) {
      return <Login />;
    }
    if (!matchRole) {
      router.push("/");
      return;
    }

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
