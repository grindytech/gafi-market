import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackProps,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import PrimaryButton from "../PrimaryButton";

export default function UploadAvatar({
  uploadFile,
  title,
  children,
  ...rest
}: {
  uploadFile: (file: File) => void;
  title: string;
} & StackProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);
  const upload = async (file: File) => {
    try {
      uploadFile(file);
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };
  return (
    <>
      <Box
        onClick={onOpen}
        w="full"
        h="full"
        justifyContent="center"
        alignItems="center"
        display="flex"
        cursor="pointer"
      >
        <Icon w="6" h="6">
          <EditIcon />
        </Icon>
      </Box>
      <Modal size="sm" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack {...rest}>
              {/* <Text>
                Upload new avatar. We recommend to upload images in 400x400
                resolution. Max 5 MB in JPEG, PNG or GIF format
              </Text> */}
              {children}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <VStack w="full">
              <InputGroup>
                <Input
                  ref={fileInputRef}
                  display="none"
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      await upload(file);
                    }
                  }}
                />
                <PrimaryButton
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                  w="full"
                >
                  Select file
                </PrimaryButton>
              </InputGroup>
              <Button w="full" onClick={onClose}>
                Cancel
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
