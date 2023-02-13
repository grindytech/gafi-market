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
  StackProps,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useBalanceOf } from "../../connectWallet/useBalanceof";
import {
  useGetChainInfo,
  useGetCollectionInfo,
  useGetPaymentTokenInfo,
} from "../../hooks/useGetSystemInfo";
import { Images } from "../../images";
import nftService from "../../services/nft.service";
import { NftDto } from "../../services/types/dtos/Nft.dto";
import { adds, remove, reset, selectBag } from "../../store/bagSlice";
import { selectProfile } from "../../store/profileSlice";
import { getUrl, numeralFormat } from "../../utils/utils";
import { EmptyState } from "../EmptyState";
import SwitchNetworkButton from "../SwitchNetworkButton";
import CartCheckoutButton from "./CartCheckoutButton";

export default function Cart() {
  const dispatch = useDispatch();
  const { items } = useSelector(selectBag);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [isLoading, setIsLoading] = useState(false);
  const realtimeData = async () => {
    const ids = items.map((i) => i.id);
    if (ids.length === 0) return [];
    const rs = await nftService.getNfts({
      idList: ids,
    });
    return rs.data.items;
  };
  const [validItems, setValidItems] = useState<NftDto[]>([]);
  const [soldOutItems, setSoldOutItems] = useState<NftDto[]>([]);
  const fetchData = async () => {
    const realTimeItems = await realtimeData();
    const sold = [];
    const valid = [];
    for (const item of items) {
      const rItem = realTimeItems?.find((i) => i.id === item.id);
      if (!rItem || rItem.sale?.id !== item.sale.id) sold.push(item);
      else valid.push(item);
    }
    setValidItems(valid);
    setSoldOutItems(sold);
  };
  const { user } = useSelector(selectProfile);
  const { chainInfo: chain } = useGetChainInfo({
    chainId: items.length > 0 ? items[0].chain : undefined,
  });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: items.length > 0 ? items[0].sale?.paymentToken : undefined,
  });
  const {
    data: balance,
    refetch: refetchBalance,
    isLoading: loadingBalance,
    isFetching: fetchingBalance,
  } = useBalanceOf({
    account: user,
    chainSymbol: chain?.symbol,
    tokenAddress: paymentInfo?.contractAddress,
    isNative: paymentInfo?.isNative,
  });

  const total = useMemo(() => {
    let total = 0;
    for (const item of validItems) {
      total += item.sale.price;
    }
    return total;
  }, [validItems]);

  useEffect(() => {
    fetchData();
  }, [items]);
  const md = useBreakpointValue({ base: false, md: true });

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
          {validItems.length || items.length}
        </Box>
      )}
      <Drawer
        isOpen={isOpen}
        placement={!md ? "bottom" : "right"}
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
              {validItems.length > 0 && (
                <HStack w="full" justifyContent="space-between">
                  <Text fontSize="sm">{validItems.length} items</Text>
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
              {validItems.map((item, index) => (
                <>
                  {index !== 0 && <Divider />}
                  <NftItem
                    onRemove={() => {
                      dispatch(remove({ id: item.id }));
                    }}
                    showRemove={true}
                    item={item}
                  />
                </>
              ))}
              {soldOutItems.length > 0 && (
                <Box pt={3} w="full">
                  <HStack w="full" justifyContent="space-between">
                    <Text
                      w="full"
                      textAlign="left"
                      fontWeight="semibold"
                      fontSize="md"
                    >
                      Sold out items
                    </Text>
                    <Button
                      onClick={() => {
                        dispatch(adds(validItems));
                        onClose();
                      }}
                      color="gray.400"
                      size="xs"
                      variant="link"
                    >
                      Clear all
                    </Button>
                  </HStack>
                  {soldOutItems.map((item, index) => (
                    <>
                      {index !== 0 && <Divider />}
                      <NftItem
                        onRemove={() => {
                          dispatch(remove({ id: item.id }));
                        }}
                        showRemove={true}
                        opacity={0.6}
                        item={item}
                      />
                    </>
                  ))}
                </Box>
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            {validItems.length > 0 && (
              <VStack w="full" spacing={3}>
                <HStack
                  rounded="lg"
                  bg="rgba(0,0,0,0.15)"
                  w="full"
                  p={3}
                  justifyContent="space-between"
                  alignContent="center"
                >
                  <Text fontSize="lg" fontWeight="semibold">
                    Total
                  </Text>
                  <Text>
                    {numeralFormat(total)} {paymentInfo?.symbol}
                  </Text>
                </HStack>
                <SwitchNetworkButton symbol={chain?.symbol} name={chain?.name}>
                  <CartCheckoutButton
                    onSuccess={onClose}
                    onError={onClose}
                    refetch={fetchData}
                    nfts={validItems}
                    disabled={balance < total || isLoading}
                    w="full"
                    total={total}
                  >
                    {balance < total ? "Insufficient balance" : "Checkout"}
                  </CartCheckoutButton>
                </SwitchNetworkButton>
              </VStack>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export const NftItem = ({
  item,
  showRemove,
  onRemove,
  ...rest
}: {
  item: NftDto;
  showRemove?: boolean;
  onRemove?: () => void;
} & StackProps) => {
  const { collectionInfo } = useGetCollectionInfo({
    collectionId: item.nftCollection,
  });
  const { paymentInfo } = useGetPaymentTokenInfo({
    paymentId: item.sale?.paymentToken,
  });
  return (
    <HStack {...rest} w="full" justifyContent="space-between">
      <HStack>
        <Image
          src={getUrl(item.image)}
          rounded="md"
          fallbackSrc={Images.Placeholder.src}
          w={16}
          h={16}
          objectFit="cover"
        />
        <VStack spacing={0} alignItems="start">
          <Link
            as={NextLink}
            target="_blank"
            href={`/collection/${collectionInfo?.id}}`}
          >
            <Text color="primary.50" fontWeight="semibold" fontSize="sm">
              {collectionInfo?.name}{" "}
              {collectionInfo?.verified && (
                <Icon color="primary.50" h={4} w={4}>
                  <HiBadgeCheck size="25px" />
                </Icon>
              )}
            </Text>
          </Link>
          <Link target="_blank" as={NextLink} href={`/nft/${item.id}`}>
            <Text>{item.name}</Text>
          </Link>

          {item?.sale?.price ? (
            <Text color="gray" fontSize="sm">
              {numeralFormat(item?.sale?.price)}&nbsp;
              {paymentInfo?.symbol}
            </Text>
          ) : (
            <Text color="gray" fontSize="sm">
              #{item.tokenId}
            </Text>
          )}
        </VStack>
      </HStack>
      {showRemove && (
        <IconButton aria-label="remove" onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      )}
    </HStack>
  );
};
