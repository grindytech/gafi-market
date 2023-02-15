import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CircularProgress,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiBadgeCheck } from "react-icons/hi";
import { useQuery } from "react-query";
import nftService from "../../services/nft.service";
import { accountService } from "../../services/user.service";
import useCustomColors from "../../theme/useCustomColors";
import { getNftImageLink, getUserName } from "../../utils/utils";
import Avatar from "../Avatar";
import { ImageWithFallback } from "../LazyImage";
import SearchBox from "../SearchBox";

export default function SearchAll() {
  const [search, setSearch] = useState<string>();
  const [focused, setFocused] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, isFetching } = useQuery(
    ["SearchAll", search],
    async () => {
      const [accounts, collections, nfts] = await Promise.all([
        accountService.profiles({ search }),
        nftService.getNftCollections({ search }),
        nftService.getNfts({ search }),
      ]);
      return {
        accounts: accounts.data,
        collections: collections.data,
        nfts: nfts.data,
      };
    },
    {
      enabled: !!search,
    }
  );

  const { bgColor, borderColor } = useCustomColors();
  const route = useRouter();
  const md = useBreakpointValue({ base: false, md: true });

  return (
    <>
      <Button
        variant="unstyled"
        onClick={(e) => {
          onOpen();
        }}
        position="relative"
      >
        <Box
          position="absolute"
          w="full"
          h="full"
          top={0}
          right={0}
          zIndex={9}
        ></Box>
        {md ? (
          <SearchBox
            inputGroupProps={{ w: "400px" }}
            placeHolder="Search nfts, collections and accounts"
          />
        ) : (
          <IconButton variant="ghost" rounded="full" aria-label="search">
            <Icon as={SearchIcon} />
          </IconButton>
        )}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalBody p={1}>
            <VStack w="full">
              <Box w="full" p={1}>
                <SearchBox
                  placeHolder="Search nfts, collections and accounts"
                  onChange={(e) => setSearch(e ? String(e).toLowerCase() : "")}
                  value={search}
                />
              </Box>
              {isLoading || isFetching ? (
                <CircularProgress size="25px" isIndeterminate />
              ) : (
                <VStack p={1} w="full" maxH={600} overflow="auto">
                  {Number(data?.accounts?.total) > 0 && (
                    <>
                      <Text fontWeight="semibold" px={2} w="full">
                        Accounts
                      </Text>
                      {data.accounts.items.map((account) => (
                        <HStack
                          onClick={() => {
                            route.push(`/profile/${account.address}`);
                            onClose();
                          }}
                          p={2}
                          w="full"
                          rounded="xl"
                          cursor="pointer"
                          _hover={{
                            boxShadow: "md",
                            bg: borderColor,
                          }}
                          transition="all ease 0.1s"
                        >
                          <Avatar
                            w="40px"
                            h="40px"
                            src={account.avatar}
                            jazzicon={{
                              diameter: 40,
                              seed: account.address,
                            }}
                          />
                          <VStack
                            overflow="hidden"
                            spacing={0}
                            w="full"
                            alignItems="start"
                          >
                            <Text
                              fontWeight="semibold"
                              noOfLines={1}
                              fontSize="sm"
                            >
                              {getUserName(account)}
                            </Text>
                            <Text color="gray.500" noOfLines={1} fontSize="sm">
                              {account.address}
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </>
                  )}
                  {Number(data?.collections?.total) > 0 && (
                    <>
                      <Text fontWeight="semibold" px={2} w="full">
                        Collections
                      </Text>
                      {data.collections.items.map((collection) => (
                        <HStack
                          onClick={() => {
                            route.push(`/collection/${collection.nftContract}`);
                            onClose();
                          }}
                          p={2}
                          w="full"
                          rounded="xl"
                          cursor="pointer"
                          _hover={{
                            boxShadow: "md",
                            bg: borderColor,
                          }}
                          transition="all ease 0.1s"
                        >
                          <Avatar
                            w="40px"
                            h="40px"
                            src={collection.avatar}
                            jazzicon={{
                              diameter: 40,
                              seed: collection.nftContract,
                            }}
                          />
                          <VStack
                            overflow="hidden"
                            spacing={0}
                            w="full"
                            alignItems="start"
                          >
                            <HStack spacing={1}>
                              <Text
                                fontWeight="semibold"
                                noOfLines={1}
                                fontSize="sm"
                              >
                                {collection.name}
                              </Text>
                              {collection?.verified && (
                                <Icon h={3} w={3}>
                                  <HiBadgeCheck size="25px" />
                                </Icon>
                              )}
                            </HStack>
                            <Text color="gray.500" noOfLines={1} fontSize="sm">
                              {collection.nftContract}
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </>
                  )}

                  {Number(data?.nfts?.total) > 0 && (
                    <>
                      <Text fontWeight="semibold" px={2} w="full">
                        NFTs
                      </Text>
                      {data.nfts.items.map((nft) => (
                        <HStack
                          onClick={() => {
                            route.push(`/nft/${nft.id}`);
                            onClose();
                          }}
                          p={2}
                          w="full"
                          rounded="xl"
                          cursor="pointer"
                          _hover={{
                            boxShadow: "md",
                            bg: borderColor,
                          }}
                          transition="all ease 0.1s"
                        >
                          <ImageWithFallback
                            src={getNftImageLink(nft.id, 100)}
                            w="40px"
                            h="40px"
                            objectFit="cover"
                          />
                          <VStack
                            overflow="hidden"
                            spacing={0}
                            // w="full"
                            alignItems="start"
                          >
                            <Text
                              fontWeight="semibold"
                              noOfLines={1}
                              fontSize="sm"
                            >
                              {nft.name}
                            </Text>
                            <Text color="gray.500" noOfLines={1} fontSize="sm">
                              #{nft.tokenId}
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </>
                  )}
                </VStack>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
