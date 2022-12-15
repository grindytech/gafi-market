import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../images";
import { remove, reset, selectBag } from "../../store/bagSlice";
import { numeralFormat } from "../../utils/utils";
import NextLink from "next/link";
import { EmptyState } from "../EmptyState";

export default function Cart() {
  const dispatch = useDispatch();
  const { items } = useSelector(selectBag);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  
  return (
    <Box position="relative">
      <IconButton
        ref={btnRef}
        rounded="full"
        variant="ghost"
        aria-label="bag"
        onClick={onOpen}
      >
        <FiShoppingBag />
      </IconButton>
      {items.length > 0 && (
        <Box
          w={4}
          h={4}
          bg={useColorModeValue("gray.700", "gray.50")}
          color={useColorModeValue("gray.50", "gray.700")}
          rounded="full"
          borderWidth={1}
          fontSize="xs"
          position="absolute"
          top={1}
          right={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {items.length}
        </Box>
      )}
      <Drawer
        size={{ base: "full", sm: "sm" }}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Bag</DrawerHeader>
          <DrawerBody w="full">
            <VStack w="full">
              {items.length === 0 && (
                <Box w="full" py={100}>
                  <EmptyState msg="Your bag is empty">
                    <Button
                      as={NextLink}
                      href="/explore/nfts"
                      onClick={onClose}
                    >
                      Explore NFTs
                    </Button>
                  </EmptyState>
                </Box>
              )}
              {items.length > 0 && (
                <HStack w="full" justifyContent="space-between">
                  <Text fontSize="sm">{items.length} items</Text>
                  <Button
                    onClick={() => {
                      dispatch(reset());
                      onClose();
                    }}
                    color="gray.400"
                    size="xs"
                    variant="link"
                  >
                    Clear all
                  </Button>
                </HStack>
              )}
              {items.map((item, index) => (
                <>
                  {index !== 0 && <Divider />}
                  <HStack w="full" justifyContent="space-between">
                    <HStack>
                      <Image
                        src={item.image}
                        rounded="md"
                        fallbackSrc={Images.Placeholder.src}
                        w={16}
                        h={16}
                      />
                      <VStack spacing={0} alignItems="start">
                        <Link
                          onClick={onClose}
                          as={NextLink}
                          href={`/collection/${item.nftCollection.id}}`}
                        >
                          <Text
                            color="primary.50"
                            fontWeight="semibold"
                            fontSize="sm"
                          >
                            {item?.nftCollection.name}{" "}
                            {item?.nftCollection.verified && (
                              <Icon color="primary.50" h={4} w={4}>
                                <HiBadgeCheck size="25px" />
                              </Icon>
                            )}
                          </Text>
                        </Link>
                        <Link
                          onClick={onClose}
                          as={NextLink}
                          href={`/nft/${item.id}`}
                        >
                          <Text>{item.name}</Text>
                        </Link>
                        <Text color="gray" fontSize="sm">
                          {numeralFormat(item?.sale.price)}&nbsp;
                          {item.sale.paymentToken.symbol}
                        </Text>
                      </VStack>
                    </HStack>
                    <IconButton
                      aria-label="remove"
                      onClick={() => {
                        dispatch(remove({ id: item.id }));
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </HStack>
                </>
              ))}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            {items.length > 0 && <Button w="full">Checkout</Button>}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
