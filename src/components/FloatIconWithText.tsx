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
      title={title}
      transition="all ease 1s"
      spacing={0}
      h={h}
      p={1}
      bg="rgba(200, 200, 200, 0.2)"
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
          pl={1}
          textOverflow="ellipsis"
          className="text"
          position="absolute"
          visibility="hidden"
          fontSize="sm"
          fontWeight="500"
          color={useColorModeValue("gray.100", "gray.100")}
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
