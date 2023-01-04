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
  const { bgColor } = useCustomColors();
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
            <HStack
              justifyContent="space-between"
              p={3}
              alignItems="end"
              w="full"
            >
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
      <VStack w="full" alignItems="start">
        <Stack
          direction={["column", "row"]}
          alignItems="start"
          justifyContent="space-between"
          w="full"
          {...rest}
        >
          <VStack alignItems="start">
            <Stack direction={["row"]} justifyContent="end" alignItems="end">
              <Avatar
                // borderRadius={12}
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
              <VStack pb={1} alignItems="start" spacing={0}>
                <Heading fontSize={{ base: "xl", md: "3xl" }}>{name}</Heading>
                <HStack alignItems="center" justifyContent="start" w="full">
                  {username && username !== address && (
                    <Text size="sm">@{username}</Text>
                  )}
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(String(address));
                      toast.success("Copied!");
                    }}
                    rightIcon={<CopyIcon color="gray.300" />}
                    variant="link"
                    _hover={{
                      textDecoration: "none",
                    }}
                    size="sm"
                  >
                    <Text color="gray.300">{shorten(address, 5, 3)}</Text>
                  </Button>
                </HStack>
              </VStack>
            </Stack>
            {description && (
              <Box>
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
