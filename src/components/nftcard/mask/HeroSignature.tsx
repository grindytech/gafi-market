import { Image, Text, VStack } from "@chakra-ui/react";
import { get } from "lodash";
import { getUrl } from "../../../utils/utils";

export const tierColorMapping = {
  common: "#aaa",
  rare: "#2675E8",
  epic: "#B711D8",
  legendary: "#DF7C0C",
  immortal: "#E80904",
  ultimate: "#DDD10E",
};

export default function HeroSignature({ tier, signatureIcon, signatureLevel }) {
  return (
    <VStack
      w={["35px", "50px"]}
      h={["35px", "50px"]}
      style={{
        border: `2px solid ${get(tierColorMapping, tier)}`,
        borderRadius: "50%",
        textAlign: "center",
        position: "relative",
      }}
    >
      <Image src={getUrl(signatureIcon, 100)} alt="signature icon" />
      <Text
        fontSize={["xs", "sm"]}
        fontWeight="bold"
        style={{
          position: "absolute",
          zIndex: 1,
          bottom: 0,
          textShadow: "black 1px 0 10px",
        }}
        color="white"
      >
        {signatureLevel}
      </Text>
    </VStack>
  );
}
