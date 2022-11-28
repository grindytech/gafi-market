import { ChakraProvider } from "@chakra-ui/react";

import { AppProps } from "next/app";
import { Provider } from "react-redux";
import Layout from "../layouts/Layout";
import W3Provider from "../layouts/W3Provider";
import store from "../store";
import theme from "../theme/theme";

import { NextAdapter } from "next-query-params";
import { QueryClient, QueryClientProvider } from "react-query";
import { QueryParamProvider } from "use-query-params";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../node_modules/slick-carousel/slick/slick.css";
import SEO from "../components/Seo";
import { Images } from "../images";
import "../styles/styles.scss";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <QueryParamProvider adapter={NextAdapter}>
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
        </QueryParamProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
