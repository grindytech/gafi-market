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
import { UserDto } from "../../services/types/dtos/UserDto";
import { accountService } from "../../services/user.service";
import { selectProfile, userData } from "../../store/profileSlice";
import PrimaryButton from "../PrimaryButton";
export default function EditProfileForm() {
  const dispatch = useDispatch();
  const { profile } = useSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: profile.name,
      username: profile.username,
      email: profile.email,
      about: profile.about,
      twitter: profile.socials?.twitter,
      facebook: profile.socials?.facebook,
      discord: profile.socials?.discord,
      website: profile.socials?.website,
      telegram: profile.socials?.telegram,
    },
  });
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
            {...register("name", {
              minLength: 1,
              maxLength: 200,
            })}
            type="text"
            placeholder="Enter your display name"
          />
          {errors.name && (
            <FormErrorMessage>
              {errors.name.message.toString()}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.username}>
          <FormLabel>Username</FormLabel>
          <InputGroup>
            <InputLeftElement children="@" />
            <Input
              defaultValue={profile.username}
              {...register("username", {
                maxLength: {
                  value: 50,
                  message: "Max length is 50",
                },
                pattern: {
                  value: /^[\w\d_]+$/i,
                  message:
                    'Username must only contain alphanumeric characters and symbol "_"',
                },
                validate: async (username) => {
                  if (!username || username === profile.username) return true;
                  let exist = undefined;
                  try {
                    await accountService.profileByAddress(username);
                    exist = "Already used by someone";
                  } catch (error) {}
                  return exist;
                },
              })}
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
            defaultValue={profile.about}
            {...register("about", {
              maxLength: {
                value: 200,
                message: "Max length is 200",
              },
            })}
            maxLength={200}
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
            {...register("email", {
              maxLength: {
                value: 100,
                message: "Max length is 100 characters",
              },
              pattern: {
                value: /^[\d\w]+@[\d\w\.]+$/g,
                message: "Email invalid",
              },
            })}
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
                {...register("twitter", {
                  pattern: {
                    value: /^(https:\/\/twitter.com\/).+$/i,
                    message: "Invalid twitter url",
                  },
                })}
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
                {...register("facebook", {
                  pattern: {
                    value: /^(https:\/\/facebook.com\/).+$/i,
                    message: "Invalid facebook url",
                  },
                })}
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
                {...register("discord", {
                  pattern: {
                    value: /^(https:\/\/discord.com\/).+$/i,
                    message: "Invalid discord url",
                  },
                })}
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
                {...register("telegram", {
                  pattern: {
                    value: /^(https:\/\/telegram.com\/).+$/i,
                    message: "Invalid telegram url",
                  },
                })}
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
                {...register("website", {
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/i,
                    message: "Invalid website url",
                  },
                })}
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
        disabled={Object.keys(errors).length > 0 || loading}
        onClick={handleSubmit(onSubmit)}
      >
        Save change
      </PrimaryButton>
    </VStack>
  );
}
