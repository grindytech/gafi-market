import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CloseButton,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";
import {
  useGetChainInfo,
  useGetCollectionInfo,
} from "../../hooks/useGetSystemInfo";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import useCustomColors from "../../theme/useCustomColors";
import { NftItem } from "../nft/Cart";
import PrimaryButton from "../PrimaryButton";
import CreateBundleConfirm from "./CreateBundleConfirm";

type Props = {
  items: NftDto[];
  onClose: () => void;
  onReset: () => void;
  onRemove: (nftId: string) => void;
};
export default function CreateBundle({
  items,
  onClose,
  onReset,
  onRemove,
}: Props) {
  const {
    isOpen: isModalOpen,
    onClose: onModalClose,
    onOpen: onModalOpen,
  } = useDisclosure();
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: items.length > 0 ? items[0].nftCollection : undefined,
  });
  const { chainInfo } = useGetChainInfo({
    chainId: items.length > 0 ? items[0].chain : undefined,
  });
  return (
    <Card h="calc(100vh - 125px)" bg={useColorModeValue("white", "gray.900")}>
      <CardHeader>
        <HStack w="full" justify="space-between">
          <Text fontWeight="bold" fontSize="xl">
            Create bundle
          </Text>
          <CloseButton onClick={onClose} />
        </HStack>
      </CardHeader>
      <CardBody overflow="auto">
        <VStack w="full">
          {items.length === 0 && <Text>Select items to continue.</Text>}
          {items.map((item, index) => (
            <>
              {index !== 0 && <Divider />}
              <NftItem
                key={item.id}
                onRemove={() => {
                  onRemove(item.id);
                }}
                showRemove={true}
                item={item}
              />
            </>
          ))}
        </VStack>
      </CardBody>
      <CardFooter>
        <VStack w="full">
          <HStack w="full" justifyContent="space-between">
            <Text>{items.length} items</Text>
            <Button
              onClick={() => {
                onReset();
              }}
              color="gray.400"
              variant="link"
            >
              Clear all
            </Button>
          </HStack>
          <PrimaryButton
            onClick={onModalOpen}
            w="full"
            disabled={items.length < 2}
          >
            Continue
          </PrimaryButton>
          <Modal isOpen={isModalOpen} onClose={onModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create bundle</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <CreateBundleConfirm
                  onClose={onModalClose}
                  onSuccess={onClose}
                  items={items}
                  nftCollection={collectionInfo}
                  chain={chainInfo}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </CardFooter>
    </Card>
  );
}

export function CreateBundleMobile({
  items,
  onClose,
  onReset,
  onRemove,
}: Props) {
  const { isOpen, onOpen, onClose: closeDrawer } = useDisclosure();
  const { borderColor } = useCustomColors();
  return (
    <Box w="full" zIndex={99} position="fixed" bottom={0} left={0} p={2}>
      <HStack
        p={2}
        bg={borderColor}
        rounded="xl"
        w="full"
        justifyContent="space-between"
        alignContent="center"
      >
        <VStack spacing={0} alignItems="start">
          <Text>Bundle sale {items.length} items</Text>
          <Button
            onClick={() => {
              onReset();
              onClose();
            }}
            size="xs"
            variant="link"
            colorScheme="red"
          >
            Cancel
          </Button>
        </VStack>
        <IconButton rounded="full" onClick={onOpen} aria-label="next">
          <FiChevronRight />
        </IconButton>
      </HStack>
      <Drawer placement="bottom" onClose={closeDrawer} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="none">
          <DrawerBody p={0}>
            <CreateBundle
              items={items}
              onClose={closeDrawer}
              onRemove={onRemove}
              onReset={onReset}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
