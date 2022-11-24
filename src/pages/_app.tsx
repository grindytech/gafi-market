import { ChakraProvider } from "@chakra-ui/react";

import { AppProps } from "next/app";
import { Provider } from "react-redux";
import Layout from "../layouts/Layout";
import W3Provider from "../layouts/W3Provider";
import store from "../store";
import theme from "../theme/theme";

import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../node_modules/slick-carousel/slick/slick.css";
import "../styles/styles.scss";
import SEO from "../components/Seo";
import { Images } from "../images";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <W3Provider>
          <Layout>
            <SEO
              image={Images.Placeholder.src}
              description="Marketplace"
              title="Marketplace"
            />
            <Component {...pageProps} />
          </Layout>
        </W3Provider>
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
