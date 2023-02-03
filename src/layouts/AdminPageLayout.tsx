import {
  HStack,
  Link,
  StackProps,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useQueryParam } from "use-query-params";
import AddCollection from "../components/collections/AddCollection";
import Collections from "../components/collections/Collections";
import AddGame from "../components/game/AddGame";
import Games from "../components/game/Games";
import UserManager from "../components/profile/UserManager";
type LinkTab = {
  key: string;
  name: string;
  children: any;
};
export const ADMIN_LINKS = [
  {
    key: "users_manager",
    name: "Users",
    children: <UserManager />,
  },
  {
    key: "collections",
    name: "Collections",
    children: <Collections statusAll={true} />,
  },
  {
    key: "collection_add",
    name: "Add Collection",
    children: <AddCollection title="Create collection" />,
  },
  {
    key: "games",
    name: "Games",
    children: <Games statusAll={true} />,
  },
  {
    key: "game_add",
    name: "Add Game",
    children: <AddGame title="Create game" />,
  },
];
export default function AdminPageLayout({
  links,
  ...rest
}: { links: LinkTab[] } & StackProps) {
  const highlightColor = useColorModeValue("gray.900", "gray.50");
  const [tab, setTab] = useQueryParam("tab");
  useEffect(() => {
    if (!tab) setTab(ADMIN_LINKS[0].key);
  }, [tab]);
  return (
    <VStack w="full" {...rest}>
      <HStack w="full" alignItems="start">
        <VStack
          position="sticky"
          borderWidth={1}
          minW="300px"
          p={3}
          rounded="lg"
          w="300px"
          top="75px"
          mr={5}
          overflow="hidden"
          spacing={5}
          py={3}
          alignItems="start"
        >
          {links.map((link) => (
            <Link
              key={`${link.key}`}
              _hover={{
                color: highlightColor,
              }}
              onClick={() => {
                setTab(link.key);
              }}
              color={tab === link.key ? highlightColor : "gray.400"}
            >
              {link.name}
            </Link>
          ))}
        </VStack>
        <VStack w="full">
          {ADMIN_LINKS.find((l) => l.key === tab)?.children}
        </VStack>
      </HStack>
    </VStack>
  );
}
