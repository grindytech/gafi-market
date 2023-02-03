import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { get } from "lodash";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import useSwal from "../../hooks/useSwal";
import { UserDto } from "../../services/types/dtos/UserDto";
import { Roles } from "../../services/types/enum";
import PrimaryButton from "../PrimaryButton";

import { accountService } from "../../services/user.service";
export default function EditUser({
  user,
  onSuccess,
}: {
  user: UserDto;
  onSuccess: () => void;
}) {
  const [roles, setRoles] = useState<Roles[]>(user.roles);
  const [isLoading, setIsLoading] = useState(false);
  const { swAlert } = useSwal();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const submitHandle = async () => {
    try {
      setIsLoading(true);
      await accountService.manageInfo({
        roles,
        address: user.address,
      });
      onSuccess();
      swAlert({
        title: "COMPLETE",
        text: `Successfully!`,
        icon: "success",
      });
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  return (
    <>
      <MenuItem onClick={onOpen}>Edit</MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit user</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems="start">
              <Text>
                <b>Name:</b> {user.name || "Unnamed"}
              </Text>
              <Text>
                <b>Username:</b> {user.username}
              </Text>
              <Text>
                <b>Address:</b> {user.address}
              </Text>
              <FormControl>
                <FormLabel>
                  <b>Roles</b>
                </FormLabel>
                <Box display="inline-block" w="full">
                  {roles.map((role) => (
                    <Tag
                      size="lg"
                      mr={1}
                      my={1}
                      key={role}
                      borderRadius="full"
                      variant="solid"
                    >
                      <TagLabel>{String(role)}</TagLabel>
                      <TagCloseButton
                        onClick={() => {
                          setRoles(Array.from(roles.filter((r) => r !== role)));
                        }}
                      />
                    </Tag>
                  ))}
                  <Menu>
                    <MenuButton
                      mr={1}
                      my={1}
                      rounded="full"
                      size="sm"
                      as={Button}
                      rightIcon={<Icon as={FiPlus} />}
                    >
                      Add
                    </MenuButton>
                    <MenuList>
                      {Object.keys(Roles).map((k) => {
                        const role = get(Roles, k);
                        return (
                          <MenuItem
                            onClick={() => {
                              setRoles(
                                Array.from([
                                  ...roles.filter((r) => r !== role),
                                  role,
                                ])
                              );
                            }}
                            key={`chooseRole-${role}`}
                          >
                            <Text>{role}</Text>
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Menu>
                </Box>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <PrimaryButton isLoading={isLoading} onClick={submitHandle}>
                Save
              </PrimaryButton>
              <Button onClick={onClose}>Close</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
