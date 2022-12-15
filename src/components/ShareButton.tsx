import {
  Button,
  IconButton,
  IconButtonProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { FaCopy, FaFacebook, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import useCustomToast from "../hooks/useCustomToast";
export default function ShareButton({
  title,
  link,
  ...rest
}: IconButtonProps & {
  title?: string;
  link?: string;
}) {
  const toast = useCustomToast();
  return (
    <>
      <Menu>
        <MenuButton>
          <IconButton size="sm" aria-label="share" {...rest}>
            <FiShare2 />
          </IconButton>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast.success("Copied!");
            }}
            justifyContent="start"
            as={Button}
            leftIcon={<FaCopy />}
          >
            Copy link
          </MenuItem>
          <MenuItem
            onClick={() => {
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${link}`,
                "_blank"
              );
            }}
            justifyContent="start"
            as={Button}
            leftIcon={<FaFacebook />}
          >
            Share on Facebook
          </MenuItem>
          <MenuItem
            onClick={() => {
              window.open(
                `https://twitter.com/intent/tweet?text=${title}&url=${link}`,
                "_blank"
              );
            }}
            justifyContent="start"
            as={Button}
            leftIcon={<FaTwitter />}
          >
            Share on Twitter
          </MenuItem>
          <MenuItem
            onClick={() => {
              window.open(`https://t.me/share?url=${link}`, "_blank");
            }}
            justifyContent="start"
            as={Button}
            leftIcon={<FaTelegramPlane />}
          >
            Share on Telegram
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
