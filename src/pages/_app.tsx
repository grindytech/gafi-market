import { ChakraProvider } from "@chakra-ui/react";

import { AppProps } from "next/app";
import { Provider } from "react-redux";
import Layout from "../layouts/Layout";
import W3Provider from "../layouts/W3Provider";
import store, { persistor } from "../store";
import theme from "../theme/theme";

import { NextAdapter } from "next-query-params";
import { QueryClient, QueryClientProvider } from "react-query";
import { PersistGate } from "redux-persist/integration/react";
import { QueryParamProvider } from "use-query-params";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "../../node_modules/slick-carousel/slick/slick.css";

import "../styles/styles.scss";

import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import Script from "next/script";
import { DefaultSeo } from "next-seo";
// import "nprogress/nprogress.css"; //styles of nprogress
//Route Events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

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
            <PersistGate loading={null} persistor={persistor}>
              <W3Provider>
                <Layout overflowY="auto" overflowX="hidden" w="100vw" h="100vh">
                  <DefaultSeo
                    title="Overmint - Nft Marketplace"
                    description="Overmint - Nft Marketplace"
                    openGraph={{
                      type: "website",
                      locale: "en_IE",
                      url: "https://overmint.io",
                      siteName: "Overmint",
                      images: [
                        {
                          url: "/og.png",
                        },
                      ],
                    }}
                    twitter={{
                      handle: "@handle",
                      site: "@site",
                      cardType: "summary_large_image",
                    }}
                  />
                  <Component {...pageProps} />
                  <Script
                    async
                    strategy="afterInteractive"
                    type="module"
                    src="https://unpkg.com/@google/model-viewer@^2.1.1/dist/model-viewer.min.js"
                  />
                </Layout>
              </W3Provider>
            </PersistGate>
          </Provider>
        </QueryParamProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
