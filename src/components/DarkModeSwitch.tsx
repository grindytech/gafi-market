import { useColorMode, IconButton, Icon } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import React from "react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <IconButton
      icon={
        <Icon w={4} h={4}>
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Icon>
      }
      aria-label="Toggle Theme"
      onClick={toggleColorMode}
      variant="ghost"
      borderRadius={50}
    />
  );
};
