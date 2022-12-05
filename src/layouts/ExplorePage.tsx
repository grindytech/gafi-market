import {
  Heading,
  HStack,
  Link,
  StackProps,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
const LINKS = [
  { href: "/explore/nfts", name: "NFTs" },
  { href: "/explore/collections", name: "Collections" },
  { href: "/explore/profiles", name: "Profiles" },
];
export default function ExplorePage({ children, ...rest }: StackProps) {
  const router = useRouter();
  const highlightColor = useColorModeValue("gray.900", "gray.50");
  return (
    <VStack w="full" {...rest}>
      <Heading w="full" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
        <HStack spacing={5} py={3} w="full" alignItems="start">
          {LINKS.map((link) => (
            <Link
              _hover={{
                color: highlightColor,
              }}
              color={
                router.pathname === link.href ? highlightColor : "gray.400"
              }
              href={link.href}
              as={NextLink}
            >
              {link.name}
            </Link>
          ))}
        </HStack>
      </Heading>
      {children}
    </VStack>
  );
}