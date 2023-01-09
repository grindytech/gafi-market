import {
  Avatar,
  AvatarGroup,
  Box,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MaskProps } from ".";

export default function HeGearMask({ nft }: MaskProps) {
  const gearClasses = nft.attributes.find((attr) => attr.key === "Class")
    ?.value as string;
  const race = nft.attributes.find((attr) => attr.key === "race")?.value;
  const tier = nft.attributes.find((attr) => attr.key === "Tier")?.value;
  const tierCssClass = tier?.replaceAll(/[^a-zA-Z]+/g, "").toLowerCase();
  const heroStrengthen = nft.attributes.find(
    (attr) => attr.key === "Hero Strengthen"
  )?.value;
  return (
    <Box w="full" h="full">
      <VStack
        w="full"
        h="full"
        alignItems="start"
        justifyContent="end"
        className="tier"
        pb={[3, 5]}
      >
        <HStack
          w="full"
          alignItems="end"
          justifyContent="space-between"
          px={[2, 5]}
          // pb={[2, 5]}
        >
          <HStack spacing={1}>
            {race && (
              <Avatar
                size={["xs", "sm"]}
                name={race.value}
                src={`/heroes-empires/race/${race.value?.toLowerCase()}.png`}
              />
            )}
            {gearClasses && (
              <AvatarGroup size={["xs", "sm"]} max={3}>
                {gearClasses.split(",").map((gearClass) => (
                  <Avatar
                    name={gearClass}
                    src={`/heroes-empires/class/${gearClass.toLowerCase()}.png`}
                  />
                ))}
              </AvatarGroup>
            )}
          </HStack>
          <VStack alignItems="end">
            {heroStrengthen && (
              <Box
                w={["40px", "50px"]}
                h={["40px", "50px"]}
                borderRadius="50%"
                overflow="hidden"
                position="relative"
              >
                <Image
                  top={0}
                  left={0}
                  w="full"
                  h="full"
                  position="absolute"
                  src={`/heroes-empires/hero_strengthen_frame.png`}
                  zIndex={9}
                />
                <Image
                  top={0}
                  left={0}
                  p={2}
                  borderRadius="50%"
                  position="absolute"
                  src={`/heroes-empires/faceAvatars/${heroStrengthen
                    .replaceAll(" ", "")
                    .toLowerCase()}.png`}
                />
              </Box>
            )}
            {tier && (
              <Text
                fontSize="sm"
                fontWeight="semibold"
                className={"ultimate"}
                color="white"
              >
                {tier}
              </Text>
            )}
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}
