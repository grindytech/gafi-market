import {
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  HamburgerIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonProps,
  Collapse,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemProps,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { FiEdit, FiLogOut, FiUser } from "react-icons/fi";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useSelector } from "react-redux";
import { useConnectWallet } from "../connectWallet/useWallet";
import useCustomToast from "../hooks/useCustomToast";
import { selectProfile } from "../store/profileSlice";
import useCustomColors from "../theme/useCustomColors";
import { shorten } from "../utils/string.util";
import Avatar from "./Avatar";
import ConnectWalletButton from "./connectWalletButton/ConnectWalletButton";
import { DarkModeSwitch } from "./DarkModeSwitch";
import SearchBox from "./SearchBox";
export const MenuItemBtn = ({ children, ...rest }: ButtonProps) => {
  return (
    <MenuItem
      display="flex"
      fontWeight="normal"
      justifyContent="start"
      as={Button}
      {...rest}
      rounded="lg"
      alignItems="center"
    >
      <Text lineHeight={1}>{children}</Text>
    </MenuItem>
  );
};

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { user } = useSelector(selectProfile);
  const { nav } = useCustomColors();
  const { reset, waitToConnect } = useConnectWallet();
  const [showSearchBox, setShowSearchBox] = useState(false);
  const md = useBreakpointValue({ base: false, md: true });
  const [search, setSearch] = useState<string>();
  const toast = useCustomToast();
  return (
    <Box
      w="full"
      borderBottom={1}
      borderStyle={"solid"}
      borderColor={nav.navBorderColor}
      bg={nav.navBgColor}
      color={nav.navTextColor}
    >
      <Container maxW="container.xl">
        <HStack
          minH={"60px"}
          py={{ base: 2 }}
          // px={{ base: 4 }}
        >
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
            <Flex
              flex={{ base: 1, md: "auto" }}
              // ml={{ base: -2 }}
              display={{ base: "block", md: "none" }}
            >
              <IconButton
                onClick={onToggle}
                icon={
                  isOpen ? (
                    <CloseIcon w={3} h={3} />
                  ) : (
                    <HamburgerIcon w={5} h={5} />
                  )
                }
                variant={"ghost"}
                aria-label={"Toggle Navigation"}
              />
            </Flex>
            <Link display="flex" alignItems="center" as={NextLink} href="/">
              <Text
                textAlign={useBreakpointValue({ base: "center", md: "left" })}
                fontFamily={"heading"}
                color={nav.navTextColor}
                fontWeight="bold"
                textTransform="uppercase"
              >
                Marketplace
              </Text>
            </Link>

            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>
          {md && (
            <Stack w={400}>
              <SearchBox
                placeHolder="Search nfts, collections and creators,..."
                value={search}
                onChange={(v) => {
                  setSearch(v);
                }}
              />
            </Stack>
          )}

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            alignItems="center"
            direction={"row"}
            spacing={3}
          >
            {!md && (
              <IconButton
                onClick={() => {
                  setShowSearchBox(!showSearchBox);
                }}
                variant="ghost"
                borderRadius={50}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            )}
            {user ? (
              <>
                <IconButton
                  variant="ghost"
                  borderRadius={50}
                  aria-label="notification"
                  icon={
                    <Icon w={5} h={5}>
                      <BellIcon />
                    </Icon>
                  }
                />
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      jazzicon={{
                        diameter: 31,
                        seed: String(user),
                      }}
                    />
                  </MenuButton>
                  <MenuList px={2}>
                    <MenuItemBtn
                      onClick={() => {
                        navigator.clipboard.writeText(String(user));
                        toast.success("Copied!");
                      }}
                      rightIcon={<CopyIcon color="gray" />}
                    >
                      {shorten(user, 7, 5)}
                    </MenuItemBtn>
                    <MenuDivider />
                    <NextLink href="/profile">
                      <MenuItemBtn leftIcon={<FiUser />}>Profile</MenuItemBtn>
                    </NextLink>
                    <MenuItemBtn leftIcon={<FiEdit />}>
                      Edit Profile
                    </MenuItemBtn>
                    <MenuItemBtn
                      color="gray"
                      leftIcon={<FiLogOut />}
                      onClick={reset}
                    >
                      Disconnect
                    </MenuItemBtn>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <ConnectWalletButton size="md" isLoading={waitToConnect} />
            )}
          </Stack>
          <DarkModeSwitch />
        </HStack>
        {/* {showSearchBox && !md && (
          <Box w="full" p={2}>
            <InputGroup size="md" w="full">
              <Input
                variant="filled"
                placeholder="Search nfts, collections and creators,..."
                _focusVisible={{
                  borderColor: "primary.300",
                }}
              />
              <InputRightElement
                pointerEvents="none"
                children={
                  <Text fontWeight="bold" fontSize="lg">
                    /
                  </Text>
                }
              />
            </InputGroup>
          </Box>
        )} */}
      </Container>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const { linkColor, linkHoverColor, popoverContentBgColor } =
    useCustomColors();
  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                as={NextLink}
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"md"}
                fontWeight="semibold"
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  const { nav } = useCustomColors();
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: nav.navSubHoverBg }}
    >
      <Stack direction={"row"} justifyContent="center" align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  const { nav } = useCustomColors();
  return (
    <Stack bg={nav.navBgColor} p={4} display={{ md: "none" }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();
  const { nav } = useCustomColors();
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={nav.navTextColor}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={nav.navTextColor}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  // {
  //   label: "Inspiration",
  //   children: [
  //     {
  //       label: "Explore Design Work",
  //       subLabel: "Trending Design to inspire you",
  //       href: "#",
  //     },
  //     {
  //       label: "New & Noteworthy",
  //       subLabel: "Up-and-coming Designers",
  //       href: "#",
  //     },
  //   ],
  // },
  // {
  //   label: "Find Work",
  //   children: [
  //     {
  //       label: "Job Board",
  //       subLabel: "Find your dream design job",
  //       href: "#",
  //     },
  //     {
  //       label: "Freelance Projects",
  //       subLabel: "An exclusive list for contract work",
  //       href: "#",
  //     },
  //   ],
  // },
  // {
  //   label: "Learn Design",
  //   href: "#",
  // },
  {
    label: "Explore",
    href: "/explore/nfts",
  },
  {
    label: "Games",
    href: "/game",
  },
  {
    label: "Nft Collections",
    href: "/nft-collection",
  },
];
