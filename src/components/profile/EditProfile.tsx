import {
  Box,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { accountService } from "../../services/user.service";
import { selectProfile, userData } from "../../store/profileSlice";
import Avatar from "../Avatar";
import withAuth from "../withAuth";
import EditProfileForm from "./EditProfileForm";
import UploadAvatar from "./UploadAvatar";
const EditProfile = () => {
  const { user, profile } = useSelector(selectProfile);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const dispatch = useDispatch();
  const uploadCover = async (file: File) => {
    try {
      setCoverLoading(true);
      const userInfo = await accountService.uploadProfileFile({
        cover: file,
      });
      dispatch(userData({ profile: userInfo }));
    } catch (error) {
      console.error(error);
    } finally {
      setCoverLoading(false);
    }
  };
  const uploadFile = async (file: File) => {
    try {
      setAvatarLoading(true);
      const userInfo = await accountService.uploadProfileFile({
        avatar: file,
      });
      dispatch(userData({ profile: userInfo }));
    } catch (error) {
      console.error(error);
    } finally {
      setAvatarLoading(false);
    }
  };
  return (
    <VStack maxW="container.md" margin="auto" w="full" position="relative">
      <Box
        rounded="xl"
        bg={useColorModeValue("gray.200", "gray.800")}
        w="full"
        pt="25%"
        minH="200px"
        position="relative"
      >
        <Box
          bgImage={profile?.cover}
          bgRepeat="no-repeat"
          bgSize="cover"
          position="absolute"
          w="full"
          h="full"
          top={0}
          left={0}
          rounded="xl"
          bgPos="center"
          className="hover-wrapper"
          overflow="hidden"
        >
          {!coverLoading && (
            <Box
              className="hover-content"
              bg={useColorModeValue("rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)")}
              position="absolute"
              top={0}
              left={0}
              w="full"
              h="full"
            >
              <UploadAvatar uploadFile={uploadCover} title="Upload cover">
                <Text>
                  Upload new cover. We recommend to upload images in 1440x360
                  resolution. Max 5 MB in JPEG format
                </Text>
              </UploadAvatar>
            </Box>
          )}
          {coverLoading && (
            <Box
              bg={useColorModeValue("rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)")}
              position="absolute"
              top={0}
              left={0}
              w="full"
              h="full"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Spinner />
            </Box>
          )}
        </Box>
      </Box>
      <VStack position="relative" px={3} pt={3} w="full" alignItems="start">
        <Box position="absolute" px={3} left={0} top={-20}>
          <Avatar
            position="relative"
            size={"xl"}
            jazzicon={{
              diameter: 96,
              seed: String(profile?.address),
            }}
            src={profile.avatar}
            bgColor={useColorModeValue("white", "black")}
            className="hover-wrapper"
          >
            {!avatarLoading && (
              <Box
                className="hover-content"
                rounded="full"
                bg={useColorModeValue("rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)")}
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
              >
                <UploadAvatar uploadFile={uploadFile} title="Upload avatar">
                  <Text>
                    Upload new avatar. We recommend to upload images in 400x400
                    resolution. Max 5 MB in JPEG, PNG or GIF format
                  </Text>
                </UploadAvatar>
              </Box>
            )}
            {avatarLoading && (
              <Box
                rounded="full"
                bg={useColorModeValue("rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)")}
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Spinner />
              </Box>
            )}
          </Avatar>
        </Box>
        <VStack pt={5} alignItems="start" w="full">
          <EditProfileForm />
        </VStack>
      </VStack>
    </VStack>
  );
};

export default withAuth(EditProfile);
