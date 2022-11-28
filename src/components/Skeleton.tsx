import {
  SkeletonProps,
  Skeleton as ChakraSkeleton,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Skeleton({ children, ...rest }: SkeletonProps) {
  return (
    <ChakraSkeleton
      {...rest}
      startColor={useColorModeValue("gray.100", "gray.700")}
      endColor={useColorModeValue("gray.400", "gray.800")}
    >
      {children}
    </ChakraSkeleton>
  );
}
