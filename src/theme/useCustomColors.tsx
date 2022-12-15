import { useColorModeValue } from "@chakra-ui/react";

export default function useCustomColors() {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const navTextColor = useColorModeValue("gray.600", "white");
  const navBorderColor = useColorModeValue("gray.200", "gray.900");
  const navBgColor = useColorModeValue("white", "gray.800");
  const navSubHoverBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  return {
    linkColor,
    linkHoverColor,
    popoverContentBgColor,
    borderColor,
    nav: {
      navTextColor,
      navBorderColor,
      navBgColor,
      navSubHoverBg,
    },
  };
}
