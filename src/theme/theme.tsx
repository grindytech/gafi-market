import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

// const fonts = {
//   heading: `sans-serif,'Open Sans'`,
//   body: `sans-serif,'Raleway'`,
// };

const breakpoints = {
  sm: "40em",
  md: "64em",
  lg: "80em",
  xl: "110em",
};
const colors = {
  primary: {
    DEFAULT: "#6023C0",
    "50": "#C6ABF0",
    "100": "#BA9AED",
    "200": "#A277E6",
    "300": "#8B55E0",
    "400": "#7332DA",
    "500": "#6023C0",
    "600": "#481A91",
    "700": "#311261",
    "800": "#190932",
    "900": "#010002",
  },
};
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
    "::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(200, 200, 200, 0.3)",
    },
    "::-webkit-scrollbar-thumb": {
      bg: "gray.100",
    },
    ".chakra-ui-dark ::-webkit-scrollbar-thumb": {
      bg: "gray.900",
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
    transition: "all ease 0.5s",
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
    "&.in-cart": {
      borderColor: "primary.300",
      borderWidth: "3px",
      rounded: "xl",
      overflow: "hidden",
    },
    ".hover-show": {
      display: "none",
    },
    _hover: {
      boxShadow: "md",
      borderColor: "primary.300",
      '[data-component-name="NFTImage"]': {
        transform: "scale(1.05)",
      },
      '[data-component-name="ShowOnHover"]': {
        background: "rgba(0,0,0,0.3)",
        visibility: "visible",
      },
      bgGradient: ["linear(to-b, cyan.100, purple.100)"],
      _dark: {
        bgGradient: ["linear(to-b, orange.800, purple.900)"],
      },
      ".hover-hidden": {
        display: "none",
      },
      ".hover-show": {
        display: "block",
      },
    },
    '[data-component-name="NFTImage"]': {
      transition: "all ease 0.5s",
    },
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
      ".react-horizontal-scrolling-menu--scroll-container::-webkit-scrollbar": {
        visibility: "visible",
      },
    },
  },
};
const Input: ComponentStyleConfig = {
  baseStyle: {
    _focusVisible: {
      borderColor: "primary.200",
      boxShadow: "primary.200",
    },
  },
};
const Button: ComponentStyleConfig = {
  variants: {
    link: {
      color: "primary.50",
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
  Button,
  SliderBox,
  Card,
  CardBody,
  CardHeader,
  NFTCard,
  NFTCardImage,
  Input,
};
const theme = extendTheme({
  styles,
  // fonts,
  breakpoints,
  components,
  shadows: {
    outline: "none",
  },
  colors,
  sizes: {
    container: {
      ...breakpoints,
    },
  },
});

export default theme;
