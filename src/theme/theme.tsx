import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";
import { createBreakpoints, StyleFunctionProps } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const styles = {
  global: {
    ".multi-slick-list .slick-list": { margin: "0 -10px" },
    ".multi-slick-list .slick-slide > div": { padding: "0 10px" },
    ".right-arrow-btn:hover .right-arrow-icon": {
      transform: "translateX(20%)",
    },
    ".right-arrow-btn .right-arrow-icon": {
      transition: "0.2s ease-in",
    },

    ".slick-dots": {
      bottom: "20px",
      li: {
        height: "7px",
        width: "50px",
      },
      ".slick-active a": {
        background: "white",
      },
    },
  },
};

const Card: ComponentStyleConfig = {
  baseStyle: {
    p: "22px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    minWidth: "0px",
    wordWrap: "break-word",
    backgroundClip: "border-box",
  },
  variants: {
    panel: (props: StyleFunctionProps) => ({
      bg: props.colorMode === "dark" ? "gray.700" : "white",
      width: "100%",
      boxShadow: "0px 3.5px 5.5px rgba(0, 0, 0, 0.02)",
      borderRadius: "10px",
    }),
  },
  defaultProps: {
    variant: "panel",
  },
};

const CardBody: ComponentStyleConfig = {
  baseStyle: {
    display: "flex",
    width: "100%",
  },
};

const CardHeader: ComponentStyleConfig = {
  baseStyle: {
    display: "flex",
    width: "100%",
  },
};
const NFTCard: ComponentStyleConfig = {
  ...Card,
  baseStyle: {
    padding: 0,
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "sm",
    _hover: {
      boxShadow: "md",
      '[data-component-name="NFTImage"]': {
        transform: "scale(1.1)",
      },
    },
    '[data-component-name="NFTImage"]': {
      transition: "all ease 0.5s",
    },
    transition: "all ease 0.5s",
    w: "fit-content",
  },
};
const NFTCardImage: ComponentStyleConfig = {
  baseStyle: {
    transition: "all ease 0.5s",
    height: 230,
    w: "full",
    objectFit: "cover",
  },
};
const Tab: ComponentStyleConfig = {
  baseStyle: {
    _selected: {
      color: "blue",
    },
  },
};
const SliderBox: ComponentStyleConfig = {
  baseStyle: {
    '[data-component-name="arrow"]': {
      transition: "all ease 0.5s",
      visibility: "hidden",
      opacity: 0,
    },
    _hover: {
      '[data-component-name="arrow"]': {
        visibility: "visible",
        opacity: 1,
      },
    },
  },
};
const components = {
  Link: {
    baseStyle: {
      _focus: {
        boxShadow: "none",
      },
      _hover: {
        textDecoration: "none",
      },
    },
  },
  SliderBox,
  Tab,
  Card,
  CardBody,
  CardHeader,
  NFTCard,
  NFTCardImage,
};
const theme = extendTheme({
  styles,
  fonts,
  breakpoints,
  components,
  shadows: {
    outline: "none",
  },
});

export default theme;
