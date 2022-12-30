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
import useCustomColors from "../../theme/useCustomColors";
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
  const {bgColor} = useCustomColors();
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
          bgRepeat="no-repeat"
          bgSize="cover"
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
      <VStack position="relative" px={2} pt={4} w="full" alignItems="start">
        <Box position="absolute" px={2} left={0} bottom={"110%"}>
          <Avatar
            borderRadius={12}
            size={"xl"}
            jazzicon={{
              diameter: 96,
              seed: String(address),
            }}
            src={avatar}
            bgColor={useColorModeValue("white", "black")}
            borderColor={bgColor}
            borderWidth={1}
          />
        </Box>
        <Stack
          direction="column"
          alignItems="start"
          justifyContent="space-between"
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
                size="sm"
              >
                <Text color="gray">{shorten(address, 5, 3)}</Text>
              </Button>
            </HStack>

            {description && (
              <Box pt={3}>
                <Text color="gray.400" size="sm">
                  {description}
                </Text>
              </Box>
            )}
          </VStack>
          {children}
        </Stack>
      </VStack>
    </VStack>
  );
}
