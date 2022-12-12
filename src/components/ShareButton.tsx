import {
  ButtonProps,
  IconButton,
  IconButtonProps,
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
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiShare } from "react-icons/fi";

export default function ShareButton({
  title,
  link,
  ...rest
}: IconButtonProps & {
  title?: string;
  link?: string;
}) {
  return (
    <>
      <Menu>
        <Tooltip label="Share">
          <MenuButton>
            <IconButton size="sm" aria-label="share">
              <FiShare />
            </IconButton>
          </MenuButton>
        </Tooltip>

        <MenuList>
          <MenuItem>Copy link</MenuItem>
          <MenuItem>Share on Facebook</MenuItem>
          <MenuItem>Share on Twitter</MenuItem>
          <MenuItem>Share on Telegram</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
