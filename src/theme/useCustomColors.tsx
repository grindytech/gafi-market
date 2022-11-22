import { useColorModeValue } from "@chakra-ui/react";

export default function useCustomColors() {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const navTextColor = useColorModeValue("gray.600", "white");
  const navBorderColor = useColorModeValue("gray.200", "gray.900");
  const navBgColor = useColorModeValue("white", "gray.800");
  const navSubHoverBg = useColorModeValue("pink.50", "gray.900"); 
  return {
    linkColor,
    linkHoverColor,
    popoverContentBgColor,
    nav: {
      navTextColor,
      navBorderColor,
      navBgColor,
      navSubHoverBg,
    },
  };
}
