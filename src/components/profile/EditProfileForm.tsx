import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaDiscord,
  FaFacebook,
  FaGlobe,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import useYupValidationResolver from "../../hooks/useYupValidationResolver";
import { accountService } from "../../services/user.service";
import { selectProfile, userData } from "../../store/profileSlice";
import PrimaryButton from "../PrimaryButton";

const validationSchema = (defaultUsername: string) =>
  yup.object({
    name: yup.string().nullable().notRequired().max(200),
    username: yup
      .string()
      .nullable()
      .notRequired()
      .max(50)
      .matches(/^[\w\d_]+$/, {
        message:
          'Username must only contain alphanumeric characters and symbol "_"',
        excludeEmptyString: true,
      })
      .test("validUsername", "Already used by someone", async (username) => {
        if (!username || username === defaultUsername) return true;
        let valid = true;
        try {
          await accountService.profileByAddress(username);
          valid = false;
        } catch (error) {}
        return valid;
      }),
    about: yup.string().max(200),
    email: yup.string().email(),
    twitter: yup
      .string()
      .max(200)
      .matches(/^(https:\/\/twitter.com\/).+$/, {
        message: "Invalid twitter url",
        excludeEmptyString: true,
      }),
    facebook: yup
      .string()
      .max(200)
      .matches(/^(https:\/\/facebook.com\/).+$/, {
        message: "Invalid facebook url",
        excludeEmptyString: true,
      }),
    discord: yup
      .string()
      .max(200)
      .matches(/^(https:\/\/discord.com\/).+$/, {
        message: "Invalid discord url",
        excludeEmptyString: true,
      }),
    telegram: yup
      .string()
      .max(200)
      .matches(/^(https:\/\/t.me\/).+$/, {
        message: "Invalid telegram url",
        excludeEmptyString: true,
      }),
    website: yup.string().max(200).url(),
  });

export default function EditProfileForm() {
  const dispatch = useDispatch();
  const { profile } = useSelector(selectProfile);

  const [loading, setLoading] = useState(false);
  const resolver = useYupValidationResolver(validationSchema(profile.username));
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver });
  const router = useRouter();
  const onSubmit = async ({
    name,
    username,
    email,
    about,
    twitter,
    facebook,
    discord,
    telegram,
    website,
  }) => {
    try {
      setLoading(true);
      const newUserData = await accountService.updateProfile({
        username,
        name,
        email,
        about,
        socials: {
          twitter,
          facebook,
          discord,
          website,
          telegram,
        },
      });
      dispatch(userData({ profile: newUserData }));
      router.push("/profile");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <VStack w="full" alignItems="start">
      <VStack w="full">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            defaultValue={profile.name}
            {...register("name")}
            type="text"
            placeholder="Enter your display name"
          />
          {errors.name && (
            <FormErrorMessage>
              {errors.name?.message?.toString()}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.username}>
          <FormLabel>Username</FormLabel>
          <InputGroup>
            <InputLeftElement children="@" />
            <Input
              defaultValue={profile.username}
              {...register("username")}
              type="text"
              placeholder="enter your username"
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.username?.message.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.about}>
          <FormLabel>About</FormLabel>
          <Textarea
            _focusVisible={{
              borderColor: "primary.200",
              boxShadow: "primary.200",
            }}
            _hover={{
              borderColor: "primary.200",
              boxShadow: "primary.200",
            }}
            defaultValue={profile.about}
            {...register("about")}
            placeholder="Tell about yourself"
          />
          {errors.about && (
            <FormErrorMessage>
              {errors.about.message.toString()}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            defaultValue={profile.email}
            {...register("email")}
            type="email"
            placeholder="Enter your email"
          />

          {errors.email ? (
            <FormErrorMessage>
              {errors.email.message.toString()}
            </FormErrorMessage>
          ) : (
            <FormHelperText>Your email for notifications</FormHelperText>
          )}
        </FormControl>
      </VStack>
      <Box w="full">
        <Text pt={3} fontSize="xl" fontWeight="semibold">
          Social links
        </Text>
        <SimpleGrid pb={3} spacing={3} w="full" columns={[1, 2]}>
          <FormControl isInvalid={!!errors.twitter}>
            <FormLabel>Twitter</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaTwitter />} />
              <Input
                defaultValue={profile.socials?.twitter}
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
                defaultValue={profile.socials?.facebook}
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
                defaultValue={profile.socials?.discord}
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
                defaultValue={profile.socials?.telegram}
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
                defaultValue={profile.socials?.website}
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
      <PrimaryButton
        isLoading={loading}
        onClick={handleSubmit(onSubmit)}
      >
        Save change
      </PrimaryButton>
    </VStack>
  );
}
