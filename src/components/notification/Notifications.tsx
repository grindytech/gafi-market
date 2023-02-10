import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  MenuItem,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import { useInfiniteQuery } from "react-query";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { Images } from "../../images";
import { NotificationDto } from "../../services/types/dtos/Notification.dto";
import { NotificationStatus } from "../../services/types/enum";
import { accountService } from "../../services/user.service";
import useCustomColors from "../../theme/useCustomColors";
import EmptyState, { ErrorState } from "../EmptyState";
import Skeleton from "../Skeleton";

export default function Notifications({
  refetchCount,
}: {
  refetchCount: () => void;
}) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState<NotificationStatus>();
  const {
    data,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["Notifications", status],
    async ({ pageParam }) => {
      const rs = await accountService.getNotifications({
        status,
        orderBy: "createdAt",
        desc: "desc",
        page: pageParam,
      });
      return rs.data;
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? Number(lastPage.currentPage) + 1 : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage.hasPrevious ? Number(firstPage.currentPage) - 1 : undefined,
      onSuccess: () => {},
      onError: (error) => {
        console.error(error);
      },
    }
  );
  const notifications = useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data]
  );
  const loadingRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver({
    target: loadingRef,
    onIntersect: fetchNextPage,
    enabled: !isLoading && !isFetching && hasNextPage,
  });
  const isEmpty = useMemo(
    () => !isError && !isLoading && !isFetching && notifications.length === 0,
    [isError, isLoading, isFetching, notifications.length]
  );
  const { bgColor, textColor, borderColor } = useCustomColors();
  const [seenAllLoading, setSeenAllLoading] = useState(false);
  const seenAllHandle = async () => {
    try {
      setSeenAllLoading(true);
      await accountService.seenAllNotification();
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSeenAllLoading(false);
    }
  };
  const route = useRouter();
  return (
    <VStack
      px={0}
      spacing={5}
      maxW="calc(100vw - 10px)"
      w="400px"
      alignItems="start"
    >
      <Box w="full">
        <VStack maxH="800px" ref={containerRef} w="full">
          <HStack py={2} px={4} w="full" justifyContent="space-between">
            <HStack>
              <Button
                // colorScheme="primary"
                variant={!status ? "solid" : "outline"}
                size="sm"
                rounded="full"
                onClick={() => {
                  setStatus(undefined);
                }}
              >
                All
              </Button>
              <Button
                // colorScheme="primary"
                onClick={() => {
                  setStatus(NotificationStatus.UnSeen);
                }}
                variant={
                  status === NotificationStatus.UnSeen ? "solid" : "outline"
                }
                size="sm"
                rounded="full"
              >
                UnSeen
              </Button>
            </HStack>
            <Tooltip label="Seen all">
              <IconButton
                onClick={seenAllHandle}
                isLoading={seenAllLoading}
                variant="ghost"
                rounded="full"
                size="sm"
                aria-label="seen all"
              >
                <Icon w="6" h="6" as={BiCheckDouble} />
              </IconButton>
            </Tooltip>
          </HStack>
          {isEmpty && (
            <Box w="full" py={10}>
              <EmptyState msg="No result found!">
                <Button
                  onClick={() => {
                    refetch();
                  }}
                >
                  Try again
                </Button>
              </EmptyState>
            </Box>
          )}
          {isError && (
            <Box w="full" py={10}>
              <ErrorState>
                <Button
                  onClick={() => {
                    refetch();
                  }}
                >
                  Try again
                </Button>
              </ErrorState>
            </Box>
          )}
          <VStack w="full" spacing={0} p={1} overflow="auto">
            {!isError && !isEmpty && (
              <>
                {isLoading || (isFetching && notifications.length === 0)
                  ? Array.from(Array(6).keys()).map((k) => (
                      <NotificationItem isLoading={true} />
                    ))
                  : notifications.map((notification, i) => (
                      <Box
                        onClick={() => {
                          if (
                            notification.status === NotificationStatus.UnSeen
                          ) {
                            accountService.updateNotificationStatus(
                              notification.id,
                              NotificationStatus.Seen
                            );
                            notification.status = NotificationStatus.Seen;
                            refetchCount();
                          }
                          if (notification.nft) {
                            route.push(`/nft/${notification.nft.id}`);
                          }
                          if (notification.bundle) {
                            route.push(`/bundle/${notification.bundle.id}`);
                          }
                        }}
                        w="full"
                        key={notification.id}
                      >
                        {/* {i > 0 && <Divider />} */}
                        <MenuItem bg="none">
                          <NotificationItem notification={notification} />
                        </MenuItem>
                      </Box>
                    ))}
                {isFetchingNextPage &&
                  Array.from(Array(6).keys()).map((k) => (
                    <NotificationItem isLoading={true} />
                  ))}
              </>
            )}
            {!isLoading && !isFetching && hasNextPage && (
              <div ref={loadingRef} />
            )}
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
}

function NotificationItem({
  notification,
  isLoading,
}: {
  notification?: NotificationDto;
  isLoading?: boolean;
}) {
  const { borderColor, textColor } = useCustomColors();
  return (
    <HStack
      _hover={
        isLoading
          ? {}
          : {
              boxShadow: "md",
              bg: borderColor,
            }
      }
      cursor="pointer"
      p={2}
      w="full"
      alignItems="start"
      rounded="md"
    >
      <Skeleton isLoaded={!isLoading}>
        <Box
          display="flex"
          w="50px"
          h="50px"
          justifyContent="center"
          alignItems="center"
        >
          {notification?.nft && (
            <Image
              src={notification?.nft?.image}
              rounded="md"
              fallbackSrc={Images.Placeholder.src}
              w="50px"
              h="50px"
              objectFit="contain"
            />
          )}
          {notification?.bundle && <Icon w="30px" h="30px" as={BsBox} />}
        </Box>
      </Skeleton>
      <VStack w="full" alignItems="start" spacing={0}>
        <Skeleton w="full" isLoaded={!isLoading}>
          <Text
            w="full"
            color={
              notification?.status === NotificationStatus.UnSeen
                ? textColor
                : "gray.500"
            }
            fontWeight={
              notification?.status === NotificationStatus.UnSeen
                ? "semibold"
                : "normal"
            }
          >
            {notification?.content}
          </Text>
        </Skeleton>
        <Skeleton w="full" isLoaded={!isLoading}>
          <HStack w="full" justifyContent="end" color="gray">
            <Button
              disabled={!notification?.externalLink}
              onClick={(e) => {
                e.preventDefault();
                window.open(notification.externalLink, "_blank");
              }}
              variant="link"
              size="sm"
              fontWeight="normal"
            >
              <HStack color="gray">
                <Tooltip
                  label={new Date(notification?.createdAt || 0).toUTCString()}
                >
                  <Text
                    fontSize="sm"
                    color={
                      notification?.status === NotificationStatus.UnSeen
                        ? textColor
                        : "gray.500"
                    }
                  >
                    {formatDistance(
                      new Date(notification?.createdAt || 0),
                      Date.now(),
                      {
                        includeSeconds: false,
                        addSuffix: true,
                      }
                    )}
                  </Text>
                </Tooltip>
                <ExternalLinkIcon />
              </HStack>
            </Button>
          </HStack>
        </Skeleton>
      </VStack>
    </HStack>
  );
}
