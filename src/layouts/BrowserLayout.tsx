import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { Provider } from "react-redux";
import store from "../store";
import theme from "../theme/theme";
import W3Provider from "./W3Provider";
export default function BrowserLayout(props: any) {
  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <W3Provider>{props.children}</W3Provider>
      </Provider>
    </ChakraProvider>
  );
}
