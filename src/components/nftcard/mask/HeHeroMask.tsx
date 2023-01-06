import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { MaskProps } from ".";
import HeroSignature from "./HeroSignature";

export const HERO_KEY = "he_hero";

export default function HeHeroMask({ nft }: MaskProps) {
  const race = nft.attributes.find((attr) => attr.key === "Race");
  const heroClass = nft.attributes.find((attr) => attr.key === "Class");
  const tier = nft.attributes.find((attr) => attr.key === "Tier");
  const tierCssClass = tier?.value?.replaceAll(/[^a-zA-Z]+/g, "").toLowerCase();
  const signature = nft.attributes.find((attr) => attr.key === "Signature");
  return (
    <Box w="full" h="full">
      <VStack
        w="full"
        h="full"
        alignItems="start"
        justifyContent="end"
        className="tier"
      >
        <HStack w="full" alignItems="end" justifyContent="space-between" px={3}>
          <HStack spacing={1}>
            {race && (
              <Image
                title={race.value}
                w={6}
                src={`/heroes-empires/race/${race.value?.toLowerCase()}.png`}
              />
            )}
            {heroClass && (
              <Image
                title={heroClass.value}
                w={6}
                src={`/heroes-empires/class/${heroClass.value?.toLowerCase()}.png`}
              />
            )}
          </HStack>
          <VStack>
            {signature && (
              <HeroSignature
                signatureIcon={signature?.value?.icon}
                signatureLevel={signature?.value?.level}
                tier={tierCssClass}
              />
            )}
            {tier && (
              <Text
                fontSize="sm"
                fontWeight="semibold"
                className={tierCssClass}
                color="white"
              >
                {tier?.value?.replace("+", "*")}
              </Text>
            )}
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}
