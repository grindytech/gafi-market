import { BellIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Icon,
  Box,
  Text,
  useDisclosure,
  Menu,
  MenuList,
  MenuButton,
  Badge,
  MenuItem,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { NotificationStatus } from "../../services/types/enum";
import { accountService } from "../../services/user.service";
import { selectProfile } from "../../store/profileSlice";
import useCustomColors from "../../theme/useCustomColors";
import Notifications from "./Notifications";

export default function NotificationButton() {
  const { user } = useSelector(selectProfile);
  const { data: countUnSeen, refetch } = useQuery(
    ["Notification", user],
    async () => {
      const rs = await accountService.getNotifications({
        size: 0,
        status: NotificationStatus.UnSeen,
      });
      return rs.data.total;
    },
    {
      enabled: !!user,
    }
  );
  const { bgColor, textColor, borderColor } = useCustomColors();

  return (
    <Box position="relative">
      <Menu isLazy>
        <MenuButton
          as={IconButton}
          variant="ghost"
          borderRadius={50}
          aria-label="notification"
          icon={
            <Icon w={5} h={5}>
              <BellIcon />
            </Icon>
          }
        />
        <MenuList bg={bgColor}>
          <Notifications refetchCount={refetch} />
        </MenuList>
      </Menu>
      {countUnSeen > 0 && (
        <Badge
          top={0}
          right={0}
          rounded="full"
          position="absolute"
          ml="1"
          fontSize="0.8em"
          colorScheme="green"
        >
          <Text fontSize="11px">{countUnSeen < 100 ? countUnSeen : "99+"}</Text>
        </Badge>
      )}
    </Box>
  );
}
