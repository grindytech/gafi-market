import { HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";

export default function FloatIconWithText({
  title,
  children,
  w,
  h,
}: {
  title?: string;
  children: any;
  w: number;
  h: number;
}) {
  return (
    <HStack
      transition="all ease 1s"
      spacing={0}
      h={h}
      p={1}
      bg={useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(0, 0, 0, 0.2)")}
      rounded="full"
      position="relative"
      overflow="hidden"
      zIndex={10}
      __css={{
        _hover: {
          ".text": {
            position: "relative",
            opacity: 1,
            visibility: "visible",
            transition: "all ease 0.5s",
          },
        },
      }}
    >
      {children}
      {title && (
        <Text
          px={1}
          textOverflow="ellipsis"
          className="text"
          position="absolute"
          visibility="hidden"
          fontSize="sm"
          fontWeight="500"
          color={useColorModeValue("gray.700", "gray.100")}
          opacity={0}
          overflow="hidden"
          whiteSpace="nowrap"
          maxW={150}
        >
          {title}
        </Text>
      )}
    </HStack>
  );
}
