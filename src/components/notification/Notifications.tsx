import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  Image,
  MenuItem,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { useMemo, useRef, useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
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
        lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage.hasPrevious ? firstPage.currentPage - 1 : undefined,
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
  return (
    <VStack px={0} spacing={5} w="full" alignItems="start">
      <Box w="full">
        <VStack maxH="800px" ref={containerRef} w="full">
          <HStack p={2} w="full" justifyContent="space-between">
            <HStack>
              <Button
                colorScheme="primary"
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
                colorScheme="primary"
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
          {!isError && !isEmpty && (
            <VStack w="full" spacing={0} p={1} overflow="auto">
              {isLoading || isFetching
                ? Array.from(Array(6).keys()).map((k) => (
                    <NotificationItem isLoading={true} />
                  ))
                : notifications.map((notification, i) => (
                    <Box
                      onClick={() => {
                        if (notification.status === NotificationStatus.UnSeen) {
                          accountService.updateNotificationStatus(
                            notification.id,
                            NotificationStatus.Seen
                          );
                          notification.status = NotificationStatus.Seen;
                          refetchCount();
                        }
                        if (notification.externalLink) {
                          window.open(notification.externalLink, "_blank");
                        }
                      }}
                      w="full"
                      key={notification.id}
                    >
                      {i > 0 && <Divider />}
                      <MenuItem bg="none">
                        <NotificationItem notification={notification} />
                      </MenuItem>
                    </Box>
                  ))}
            </VStack>
          )}
          {!isLoading && !isFetching && hasNextPage && <div ref={loadingRef} />}
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
        <Image
          src={notification?.nft?.image}
          rounded="md"
          fallbackSrc={Images.Placeholder.src}
          w="50px"
          h="50px"
          objectFit="contain"
        />
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
        <Skeleton isLoaded={!isLoading}>
          <Tooltip label={new Date(notification?.createdAt).toUTCString()}>
            <Text
              fontSize="sm"
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
        </Skeleton>
      </VStack>
    </HStack>
  );
}
