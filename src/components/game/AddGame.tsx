import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaTwitter,
  FaFacebook,
  FaDiscord,
  FaTelegram,
  FaGlobe,
} from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import * as yup from "yup";
import useSwal from "../../hooks/useSwal";
import useYupValidationResolver from "../../hooks/useYupValidationResolver";
import nftService from "../../services/nft.service";
import { GameDto } from "../../services/types/dtos/GameDto";
import { NftCollectionDto } from "../../services/types/dtos/NftCollectionDto";
import { Status } from "../../services/types/enum";
import { AddGameParams } from "../../services/types/params/AddGameParams";
import { checkIfFilesAreTooBig } from "../../utils/utils";
import Avatar from "../Avatar";
import ChooseFileImage from "../ChooseFileImage";
import ChooseCollections from "../collections/ChooseCollections";
import PrimaryButton from "../PrimaryButton";

const validationSchema = yup.object({
  cover: yup
    .mixed()
    .nullable()
    .test("cover-size", "Max size is 5mb", (files) =>
      checkIfFilesAreTooBig(files, 5)
    ),
  avatar: yup
    .mixed()
    .nullable()
    .test("avatar-size", "Max size is 5mb", (files) =>
      checkIfFilesAreTooBig(files, 5)
    ),
  featuredImage: yup
    .mixed()
    .nullable()
    .test("featured-size", "Max size is 5mb", (files) =>
      checkIfFilesAreTooBig(files, 5)
    ),
  name: yup.string().required("Name is required").max(200),
  description: yup.string().required("Description is required").max(500),
  owner: yup.string().required("Owner address is required"),
  alias: yup.string().required("Short url is required").max(200),
  collections: yup.string(),
  status: yup.string().oneOf(Object.values(Status)),
});
type Props = {
  game?: GameDto;
  title: string;
  edit?: boolean;
  onSuccess?: () => void;
};
export default function AddGame({ game, title, edit, onSuccess }: Props) {
  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver,
    defaultValues: {
      cover: undefined,
      avatar: undefined,
      featuredImage: undefined,
      name: game?.name,
      alias: game?.key,
      description: game?.description,
      owner: game?.owners ? game?.owners[0] : undefined,
      twitter: game?.socials?.twitter,
      facebook: game?.socials?.facebook,
      discord: game?.socials?.discord,
      telegram: game?.socials?.telegram,
      website: game?.socials?.website,
      collections: game?.collections?.join(","),
      status: game?.status,
    },
  });
  const [loading, setLoading] = useState(false);
  const { swAlert } = useSwal();
  const router = useRouter();
  const coverFile = watch("cover");
  const avatarFile = watch("avatar");
  const featuredImageFile = watch("featuredImage");
  const shortLinkLeftRef = useRef(null);
  const gameStatus = watch("status");

  const [collections, setCollections] = useState<NftCollectionDto[]>([]);
  useEffect(() => {
    setValue("collections", collections.map((p) => p.id).join(","));
  }, [collections]);
  useEffect(() => {
    if (game) {
      setCollections((game?.collections as NftCollectionDto[]) || []);
    }
  }, [game]);

  const onSubmit = async ({
    cover,
    avatar,
    featuredImage,
    name,
    alias,
    description,
    owner,
    twitter,
    facebook,
    discord,
    telegram,
    website,
    collections,
    status,
  }) => {
    try {
      setLoading(true);
      const nftCollection = String(collections).split(",");
      const params: AddGameParams = {
        cover: cover ? cover[0] : undefined,
        avatar: avatar ? avatar[0] : undefined,
        featuredImage: featuredImage ? featuredImage[0] : undefined,
        key: alias,
        name,
        owners: [owner],
        status,
        description,
        collections: nftCollection,
        socials: JSON.stringify({
          telegram,
          twitter,
          website,
          discord,
          facebook,
        }),
      };
      if (!edit) {
        await nftService.createGame(params);
      } else {
        await nftService.updateGame(game.id, params);
      }
      onSuccess && onSuccess();
      reset();
      swAlert({
        title: "COMPLETE",
        text: `Successfully!`,
        icon: "success",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonText: "Detail",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) router.push("/game/" + alias);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <VStack spacing={5} w="full" alignItems="start">
      <Heading>{title}</Heading>
      <VStack spacing={5} w="full" alignItems="start">
        <FormControl w="full" isInvalid={!!errors.avatar}>
          <FormLabel>Avatar</FormLabel>
          <FormHelperText mb={3} w="full">
            We recommend to upload images in 400x400 resolution. Max 5 MB in
            JPEG format
          </FormHelperText>
          <ChooseFileImage
            defaultImage={game?.avatar}
            rounded="full"
            heigh="100%"
            maxW="200px"
            error={errors.avatar?.message?.toString()}
            coverFile={avatarFile}
          >
            <Input
              {...register("avatar")}
              display="none"
              type="file"
              accept="image/png,image/jpeg,image/gif"
            />
          </ChooseFileImage>
        </FormControl>
        <FormControl isInvalid={!!errors.featuredImage}>
          <FormLabel>Featured image</FormLabel>
          <FormHelperText mb={3} w="full">
            This image will be used for featuring your collection on the
            homepage, category pages, or other promotional areas. We recommend
            to upload images in 600x400 resolution. Max 5 MB in JPEG format
          </FormHelperText>
          <ChooseFileImage
            defaultImage={game?.featuredImage}
            heigh="66%"
            maxW="300px"
            error={errors.featuredImage?.message?.toString()}
            coverFile={featuredImageFile}
          >
            <Input
              {...register("featuredImage")}
              display="none"
              type="file"
              accept="image/png,image/jpeg,image/gif"
            />
          </ChooseFileImage>
        </FormControl>
        <FormControl isInvalid={!!errors.cover}>
          <FormLabel>Cover</FormLabel>
          <FormHelperText mb={3} w="full">
            We recommend to upload images in 1440x360 resolution. Max 5 MB in
            JPEG format
          </FormHelperText>
          <ChooseFileImage
            defaultImage={game?.cover}
            heigh="25%"
            maxW="1440px"
            error={errors.cover?.message?.toString()}
            coverFile={coverFile}
          >
            <Input
              {...register("cover")}
              display="none"
              type="file"
              accept="image/png,image/jpeg,image/gif"
            />
          </ChooseFileImage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            {...register("name")}
            type="text"
            placeholder="Enter name"
            defaultValue={game?.name}
          />
          <FormErrorMessage>
            {errors.name?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.alias}>
          <FormLabel>Short link</FormLabel>
          <InputGroup>
            <InputLeftElement ref={shortLinkLeftRef} w="fit-content">
              <Text>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {`${window?.location.protocol}//${window?.location.host}/game/`}
              </Text>
            </InputLeftElement>
            <Input
              pl={`${shortLinkLeftRef.current?.offsetWidth + 2 || 100}px`}
              {...register("alias")}
              type="text"
              placeholder="Input short url"
              defaultValue={game?.key}
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.alias?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register("description")}
            placeholder="Game description"
          />
          <FormErrorMessage>
            {errors.description?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.owner}>
          <FormLabel>Owner address</FormLabel>
          <Input
            {...register("owner")}
            type="text"
            placeholder="Enter owner address"
            defaultValue={game?.owners ? game?.owners[0] : undefined}
            // disabled={!!(collection?.owners && collection?.owners[0])}
          />
          <FormErrorMessage>
            {errors.owner?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.collections}>
          <FormLabel>Game collections</FormLabel>
          <Box display="inline-block" w="full">
            {collections.map((c) => (
              <Tag
                size="lg"
                mr={1}
                my={1}
                key={c.id}
                borderRadius="full"
                variant="solid"
              >
                <TagLabel>
                  <HStack
                    py={1}
                    w="full"
                    justifyContent="start"
                    alignItems="center"
                    lineHeight="1em"
                  >
                    <Avatar
                      w="30px"
                      h="30px"
                      src={c.avatar}
                      jazzicon={{
                        diameter: 30,
                        seed: c.key || "",
                      }}
                    />

                    <VStack fontSize="xs" spacing={0} alignItems="start">
                      <Text>{c.name}</Text>
                      <Text color="gray.300">{c.key}</Text>
                    </VStack>
                  </HStack>
                </TagLabel>
                <TagCloseButton
                  onClick={() => {
                    setCollections(
                      Array.from(collections.filter((item) => item.id !== c.id))
                    );
                  }}
                />
              </Tag>
            ))}
            <Menu>
              <MenuButton
                mr={1}
                my={1}
                rounded="full"
                size="md"
                as={Button}
                rightIcon={<Icon as={FiPlus} />}
              >
                Add
              </MenuButton>
              <MenuList zIndex={9}>
                <ChooseCollections
                  selected={collections}
                  onChange={(c) => {
                    setCollections(
                      Array.from([
                        ...collections.filter((item) => item.id !== c.id),
                        c,
                      ])
                    );
                  }}
                />
              </MenuList>
            </Menu>
          </Box>
          <Input type="hidden" {...register("collections")} />
          <FormErrorMessage>
            {errors.collections?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.status}>
          <FormLabel> Status</FormLabel>
          <RadioGroup
            onChange={(v) => {
              setValue("status", v);
            }}
            value={gameStatus || game?.status}
          >
            <Stack direction="row">
              {Object.values(Status).map((v) => (
                <Radio value={v}>{v}</Radio>
              ))}
            </Stack>
          </RadioGroup>
          <Input type="hidden" {...register("status")} />

          <FormErrorMessage>
            {errors.status?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
      </VStack>
      <Box w="full">
        <Text pt={3} fontSize="xl" fontWeight="semibold">
          Social links
        </Text>
        <SimpleGrid py={3} spacing={3} w="full" columns={[1, 2]}>
          <FormControl isInvalid={!!errors.twitter}>
            <FormLabel>Twitter</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaTwitter />} />
              <Input
                defaultValue={game?.socials?.twitter}
                type="text"
                {...register("twitter")}
                placeholder="https://twitter.com/"
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.twitter?.message.toString()}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.facebook}>
            <FormLabel>Facebook</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaFacebook />} />
              <Input
                {...register("facebook")}
                defaultValue={game?.socials?.facebook}
                type="text"
                placeholder="https://facebook.com/"
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.facebook?.message.toString()}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.discord}>
            <FormLabel>Discord</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaDiscord />} />
              <Input
                {...register("discord")}
                defaultValue={game?.socials?.discord}
                type="text"
                placeholder="https://discord.com/"
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.discord?.message.toString()}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.telegram}>
            <FormLabel>Telegram</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaTelegram />} />
              <Input
                {...register("telegram")}
                defaultValue={game?.socials?.telegram}
                type="text"
                placeholder="https://t.me/"
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.telegram?.message.toString()}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.website}>
            <FormLabel>Website</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaGlobe />} />
              <Input
                {...register("website")}
                defaultValue={game?.socials?.website}
                type="text"
                placeholder="https://"
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.website?.message.toString()}
            </FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      </Box>
      <PrimaryButton isLoading={loading} onClick={handleSubmit(onSubmit)}>
        {edit ? "Edit game" : "Create game"}
      </PrimaryButton>
    </VStack>
  );
}
