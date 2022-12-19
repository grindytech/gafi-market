import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import useCustomToast from "../../hooks/useCustomToast";
import { Socials } from "../../services/types/dtos/Socials";
import { shorten } from "../../utils/utils";
import Avatar from "../Avatar";
import ShareButton from "../ShareButton";
import SocialGroup from "./SocialGroup";

type Props = {
  cover?: string;
  avatar?: string;
  name: string;
  socials?: Socials;
  address: string;
  username?: string;
  description?: string;
};
export default function ProfileHeader({
  cover,
  avatar,
  name,
  socials,
  address,
  username,
  description,
  children,
  ...rest
}: Props & StackProps) {
  const toast = useCustomToast();
  return (
    <VStack w="full" position="relative">
      <Box
        rounded="xl"
        bg={useColorModeValue("gray.200", "gray.800")}
        w="full"
        pt="25%"
        minH="200px"
        position="relative"
      >
        <Box
          bgImage={cover}
          bgRepeat='no-repeat'
          bgSize='cover'
          position="absolute"
          w="full"
          h="full"
          top={0}
          left={0}
          rounded="xl"
          bgPos="center"
        >
          <VStack h="full" w="full" alignItems="start" justifyContent="end">
            <HStack justifyContent="space-between" p={3} w="full">
              <Box></Box>
              <HStack>
                <SocialGroup socials={socials} />
                <ShareButton
                  rounded="full"
                  size="sm"
                  aria-label="share"
                  title={name}
                  link={window.location.href}
                />
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </Box>
      <VStack position="relative" px={3} pt={2} w="full" alignItems="start">
        <Box position="absolute" px={3} left={0} top={-14}>
          <Avatar
            size={"lg"}
            jazzicon={{
              diameter: 64,
              seed: String(address),
            }}
            src={avatar}
          />
        </Box>
        <Stack
          direction={{ md: "row", base: "column" }}
          alignItems="start"
          w="full"
          {...rest}
        >
          <VStack alignItems="start" spacing={0}>
            <Heading fontSize={{ base: "xl", md: "3xl" }}>{name}</Heading>
            <HStack justifyContent="start" w="full">
              {username && username !== address && (
                <Text size="sm">@{username}</Text>
              )}
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(String(address));
                  toast.success("Copied!");
                }}
                rightIcon={<CopyIcon color="gray" />}
                variant="link"
                _hover={{
                  textDecoration: "none",
                }}
              >
                <Text size="sm" color="gray">
                  {shorten(address, 5, 3)}
                </Text>
              </Button>
            </HStack>
            {description && <Text size="sm">{description}</Text>}
          </VStack>
          {children}
        </Stack>
      </VStack>
    </VStack>
  );
}
