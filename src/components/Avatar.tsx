import { Avatar as ChakraAvatar, AvatarProps } from "@chakra-ui/react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

export default function Avatar({
  jazzicon,
  ...rest
}: AvatarProps & {
  jazzicon: {
    diameter: number;
    seed: string;
  };
}) {
  return (
    <ChakraAvatar
      {...rest}
      icon={
        <Jazzicon
          diameter={jazzicon.diameter}
          seed={jsNumberForAddress(jazzicon.seed)}
        />
      }
    />
  );
}
