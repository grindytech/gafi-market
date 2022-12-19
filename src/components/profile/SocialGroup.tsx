import { HStack, IconButton } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaDiscord, FaTelegram, FaGlobe } from "react-icons/fa";
import { Socials } from "../../services/types/dtos/Socials";

const SOCIAL_ITEMS_ICONS = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  discord: FaDiscord,
  telegram: FaTelegram,
  website: FaGlobe,
};
const SOCIAL_ITEMS = ["facebook", "twitter", "discord", "telegram", "website"];
const SocialGroup = ({ socials }: { socials: Socials }) => {
  return (
    <HStack>
      {SOCIAL_ITEMS.map((item) => {
        const social = socials ? socials[item] : undefined;
        return (
          social && (
            <IconButton
              onClick={() => {
                window.open(social, "_blank");
              }}
              rounded="full"
              size="sm"
              aria-label=""
            >
              {SOCIAL_ITEMS_ICONS[item] ? SOCIAL_ITEMS_ICONS[item]() : <></>}
            </IconButton>
          )
        );
      })}
    </HStack>
  );
};

export default SocialGroup;
