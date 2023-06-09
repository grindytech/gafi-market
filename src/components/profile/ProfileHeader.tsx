import { CopyIcon } from "@chakra-ui/icons";
import {
  Accordion,
  Box,
  Button,
  Collapse,
  Heading,
  HStack,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import linkifyStr from "linkify-string";
import { useMemo, useRef } from "react";
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
  address?: string;
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
  const { isOpen: showDescription, onToggle: toggleDescription } =
    useDisclosure();
  const descriptionRef = useRef(null);
  const descHeight = useMemo(() => {
    const h = Number(descriptionRef?.current?.clientHeight);
    return h < 75 ? h : 75;
  }, [descriptionRef?.current?.clientHeight]);
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
                  link={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                />
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </Box>
      <VStack w="full" alignItems="start">
        <Stack
          direction={["column"]}
          alignItems="start"
          justifyContent="space-between"
          w="full"
          {...rest}
        >
          <VStack alignItems="start">
            <Stack direction={["row"]} justifyContent="end" alignItems="end">
              <Avatar
                size={"xl"}
                jazzicon={{
                  diameter: 96,
                  seed: String(address || ""),
                }}
                src={avatar}
                borderColor={"primary.500"}
                borderWidth={0}
              />
              <VStack pb={1} alignItems="start" spacing={0}>
                <Heading fontSize={{ base: "xl", md: "3xl" }}>{name}</Heading>
                <HStack alignItems="center" justifyContent="start" w="full">
                  {username && username !== address && (
                    <Text size="sm">@{username}</Text>
                  )}
                  {address && (
                    <Button
                      onClick={() => {
                        window.navigator.clipboard.writeText(String(address));
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
                  )}
                </HStack>
              </VStack>
            </Stack>
            {description && (
              <>
                <Collapse startingHeight={descHeight} in={showDescription}>
                  <VStack ref={descriptionRef}>
                    <Text
                      dangerouslySetInnerHTML={{
                        __html: linkifyStr(description),
                      }}
                      color="gray.500"
                      size="sm"
                    ></Text>
                  </VStack>
                </Collapse>
                {descHeight === 75 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={toggleDescription}
                    mt="1rem"
                  >
                    {showDescription ? "Less" : "More"}
                  </Button>
                )}
              </>
            )}
          </VStack>

          {children}
        </Stack>
      </VStack>
    </VStack>
  );
}
