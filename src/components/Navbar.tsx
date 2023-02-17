import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonProps,
  Collapse,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
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
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { FiEdit, FiLogIn, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useConnectWallet } from "../connectWallet/useWallet";
import useCustomToast from "../hooks/useCustomToast";
import { Roles } from "../services/types/enum";
import { selectBag } from "../store/bagSlice";
import { selectProfile } from "../store/profileSlice";
import useCustomColors from "../theme/useCustomColors";
import { shorten } from "../utils/string.util";
import Avatar from "./Avatar";
import ConnectWalletButton from "./connectWalletButton/ConnectWalletButton";
import { DarkModeSwitch } from "./DarkModeSwitch";
import Cart from "./nft/Cart";
import NotificationButton from "./notification/NotificationButton";
import SearchAll from "./search/SearchAll";
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
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { user, profile, isLoggedIn } = useSelector(selectProfile);
  const { nav } = useCustomColors();
  const { reset, waitToConnect } = useConnectWallet();
  const [showSearchBox, setShowSearchBox] = useState(false);
  const md = useBreakpointValue({ base: false, md: true });
  const [search, setSearch] = useState<string>();
  const toast = useCustomToast();
  const dispatch = useDispatch();
  const { isOpen: isOpenBag } = useSelector(selectBag);
  const btnMenuRef = React.useRef();
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
        <HStack h={"60px"} py={{ base: 2 }}>
          <Flex flex={{ base: 1 }} justify="start">
            <Flex mr={2} display={{ base: "block", md: "none" }}>
              <IconButton
                ref={btnMenuRef}
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
                textAlign="left"
                fontFamily={"heading"}
                color={nav.navTextColor}
                fontWeight="bold"
                textTransform="uppercase"
              >
                Overmint
              </Text>
            </Link>

            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            alignItems="center"
            direction={"row"}
            spacing={3}
          >
            <SearchAll />
            {/* {!md && (
              <IconButton
                onClick={() => {cell
                  setShowSearchBox(!showSearchBox);
                }}
                variant="ghost"
                borderRadius={50}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            )} */}
            <DarkModeSwitch />

            <Cart />
          </Stack>
          {user ? (
            <>
              <NotificationButton />
              {md && (
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
                      src={profile.avatar}
                    />
                  </MenuButton>
                  <MenuList px={2}>
                    <MenuItemBtn
                      onClick={() => {
                        window.navigator.clipboard.writeText(String(user));
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
                    <NextLink href="/profile/edit">
                      <MenuItemBtn leftIcon={<FiEdit />}>
                        Edit Profile
                      </MenuItemBtn>
                    </NextLink>
                    {isLoggedIn &&
                      profile.roles?.includes(Roles.superAdmin) && (
                        <NextLink href="/admin">
                          <MenuItemBtn leftIcon={<FiSettings />}>
                            Admin dashboard
                          </MenuItemBtn>
                        </NextLink>
                      )}
                    <MenuItemBtn
                      color="gray"
                      leftIcon={<FiLogOut />}
                      onClick={reset}
                    >
                      Disconnect
                    </MenuItemBtn>
                  </MenuList>
                </Menu>
              )}
            </>
          ) : (
            md && <ConnectWalletButton size="md" isLoading={waitToConnect} />
          )}
        </HStack>
      </Container>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnMenuRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Link display="flex" as={NextLink} href="/">
              <Text
                fontFamily={"heading"}
                color={nav.navTextColor}
                fontWeight="bold"
                textTransform="uppercase"
              >
                Overmint
              </Text>
            </Link>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody>
            <MobileNav onClose={onClose} />
          </DrawerBody>
          <DrawerFooter>
            {!user && <ConnectWalletButton leftIcon={<FiLogIn />} w="full" />}
            {user && (
              <Button onClick={reset} leftIcon={<FiLogOut />} w="full">
                Disconnect
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

const DesktopNav = () => {
  const { linkColor, linkHoverColor, popoverContentBgColor } =
    useCustomColors();

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <DesktopMenuItem key={navItem.href} navItem={navItem} />
      ))}
    </Stack>
  );
};

const DesktopMenuItem = ({ navItem }) => {
  const router = useRouter();
  const current = useMemo(() => {
    if (router.pathname === navItem.href) {
      return true;
    }
    if (navItem.children) {
      return !!navItem.children.find((c) => router.pathname === c.href);
    }
    return false;
  }, [router.pathname]);

  const { linkColor, linkHoverColor, popoverContentBgColor } =
    useCustomColors();
  return (
    <Box key={navItem.label}>
      <Popover trigger={"hover"} placement={"bottom-start"}>
        <PopoverTrigger>
          <Link
            as={NextLink}
            p={2}
            href={navItem.href ?? "#"}
            fontSize={"md"}
            fontWeight={current ? "bold" : "medium"}
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
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  const { nav } = useCustomColors();
  return (
    <Link
      as={NextLink}
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
            _groupHover={{ color: "primary.400" }}
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
          <Icon color={"primary.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ onClose }: { onClose: () => void }) => {
  const { isLoggedIn, profile } = useSelector(selectProfile);
  return (
    <Stack>
      {MOBILE_NAV_ITEMS.map((navItem) => (
        <MobileNavItem onClose={onClose} key={navItem.label} {...navItem} />
      ))}
      {isLoggedIn && profile.roles?.includes(Roles.superAdmin) && (
        <MobileNavItem
          onClose={onClose}
          key={"admin dashboard"}
          label="Admin dashboard"
          href="/admin"
        />
      )}
    </Stack>
  );
};

const MobileNavItem = ({
  label,
  children,
  href,
  onClose,
}: NavItem & { onClose?: () => void }) => {
  const { isOpen, onToggle, onOpen } = useDisclosure();
  const { nav } = useCustomColors();
  return (
    <Stack spacing={1}>
      <Link
        onClick={(e) => {
          children && onToggle();
          !children && onClose();
        }}
        py={2}
        as={NextLink}
        _hover={{
          textDecoration: "none",
        }}
        href={!children ? href : "#"}
        w="full"
        display="flex"
        justifyContent="space-between"
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
            color={"gray"}
          />
        )}
      </Link>
      <Collapse in={isOpen} animateOpacity>
        <Stack pt={0} mt={0} pl={4} align={"start"}>
          {children &&
            children.map((child) => (
              <Link
                onClick={onClose}
                as={NextLink}
                key={child.label}
                py={2}
                href={child.href}
              >
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
  icons?: any;
  onClick?: () => void;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Explore",
    href: "/explore/nfts",
    children: [
      {
        label: "NFTs",
        href: "/explore/nfts",
      },
      {
        label: "NFT Collections",
        href: "/explore/collections",
      },
      {
        label: "Games",
        href: "/explore/games",
      },
    ],
  },
  {
    label: "Market",
    href: "/nft-market",
    children: [
      {
        label: "NFTs Market",
        href: "/nft-market",
      },
      {
        label: "Bundle Sale",
        href: "/nft-market/bundles",
      },
    ],
  },
];

const MOBILE_NAV_ITEMS: Array<NavItem> = [
  {
    label: "Account",
    children: [
      {
        label: "Profile",
        href: "/profile",
      },
      {
        label: "Edit profile",
        href: "/profile/edit",
      },
    ],
  },
  {
    label: "Explore",
    href: "/explore/nfts",
    children: [
      {
        label: "NFTs",
        href: "/explore/nfts",
      },
      {
        label: "NFT Collections",
        href: "/explore/collections",
      },
      {
        label: "Games",
        href: "/explore/games",
      },
    ],
  },
  {
    label: "Market",
    href: "/nft-market",
    children: [
      {
        label: "NFTs Market",
        href: "/nft-market",
      },
      {
        label: "Bundle Sale",
        href: "/nft-market/bundles",
      },
    ],
  },
];
