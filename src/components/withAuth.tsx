import { useSelector } from "react-redux";
import { selectProfile } from "../store/profileSlice";
import Login from "./Login";

const withAuth = (Component) => {
  const Auth = (props) => {
    const { isLoggedIn } = useSelector(selectProfile);

    // If user is not logged in, return login component
    if (!isLoggedIn) {
      return <Login />;
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
