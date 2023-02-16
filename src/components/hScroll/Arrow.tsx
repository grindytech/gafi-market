import {
  IconButton,
  IconButtonProps,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

import { VisibilityContext } from "react-horizontal-scrolling-menu";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Arrow({
  children,
  disabled,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
} & IconButtonProps) {
  return (
    <IconButton
      aria-label="arrow"
      disabled={disabled}
      onClick={onClick}
      variant="ghost"
      rounded="full"
      colorScheme="gray"
      bg="gray.700"
      color="white"
      _hover={{
        bg: "gray.500",
      }}
      style={{
        cursor: "pointer",
        opacity: disabled ? "0" : "1",
        userSelect: "none",
      }}
      zIndex={3}
      {...rest}
    >
      {children}
    </IconButton>
  );
}

export function LeftArrow() {
  const { isFirstItemVisible, scrollPrev, visibleElements, initComplete } =
    React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );
  React.useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleElements.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleElements]);
  const top = useBreakpointValue({ base: "50%", md: "50%" });
  const side = useBreakpointValue({ base: "5px", md: "5px" });
  return (
    <Arrow
      position="absolute"
      left={side}
      top={top}
      transform={"translate(0%, -50%)"}
      aria-label="left arrow"
      disabled={disabled}
      onClick={() => scrollPrev()}
    >
      <FiChevronLeft size="30px" />
    </Arrow>
  );
}

export function RightArrow() {
  const { isLastItemVisible, scrollNext, visibleElements } =
    React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !visibleElements.length && isLastItemVisible
  );
  React.useEffect(() => {
    if (visibleElements.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleElements]);
  const top = useBreakpointValue({ base: "50%", md: "50%" });
  const side = useBreakpointValue({ base: "5px", md: "5px" });
  return (
    <Arrow
      position="absolute"
      right={side}
      top={top}
      transform={"translate(0%, -50%)"}
      aria-label="right arrow"
      disabled={disabled}
      onClick={() => scrollNext()}
    >
      <FiChevronRight size="30px" />
    </Arrow>
  );
}
