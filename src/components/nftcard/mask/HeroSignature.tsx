import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { get } from "lodash";

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
      style={{
        width: "50px",
        height: "50px",
        border: `2px solid ${get(tierColorMapping, tier)}`,
        borderRadius: "50%",
        textAlign: "center",
        position: "relative",
        // background: "rgba(255,255,255,0.5)",
      }}
    >
      <Image src={signatureIcon} alt="signature icon" />
      <Text
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
