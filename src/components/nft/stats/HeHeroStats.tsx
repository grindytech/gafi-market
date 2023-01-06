import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Collapse,
  HStack,
  Image,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { NftDto } from "../../../services/types/dtos/Nft.dto";

export default function HeHeroStats({ nft }: { nft: NftDto }) {
  const signature = nft.attributes.find((attr) => attr.key === "Signature");
  const abilities = nft.attributes.find((attr) => attr.key === "Abilities");
  const basicStats = nft.attributes.find((attr) => attr.key === "BasicStats");

  const { isOpen: isSignatureShow, onToggle: signatureToggle } =
    useDisclosure();
  return (
    <Box
      borderTop="none"
      borderBottom="none"
      w="full"
      borderWidth={1}
      rounded="xl"
      overflow="hidden"
    >
      <Accordion w="full" defaultIndex={[0, 1, 2, 3]} allowMultiple>
        {signature && (
          <AccordionItem w="full">
            <AccordionButton
              _hover={{ bg: "none" }}
              w="full"
              justifyContent="space-between"
            >
              <Text fontSize="xl" fontWeight="semibold">
                Signature
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <VStack alignItems="start">
                <HStack alignItems="end">
                  <Image h="60px" src={signature?.value?.icon} />
                  <VStack
                    spacing={0}
                    fontSize="md"
                    color="gray"
                    alignItems="start"
                  >
                    <Text>{signature.value.name}</Text>
                    <Text>Level {signature.value.level}</Text>
                  </VStack>
                </HStack>
                <Collapse startingHeight={20} in={isSignatureShow}>
                  <VStack
                    spacing={1}
                    alignItems="start"
                    fontSize="sm"
                    color="gray.500"
                  >
                    {signature.value.abilityLv0 && (
                      <Text>Lv0: {signature.value.abilityLv0}</Text>
                    )}
                    {signature.value.abilityLv10 && (
                      <Text>Lv10: {signature.value.abilityLv10}</Text>
                    )}
                    {signature.value.abilityLv20 && (
                      <Text>Lv20: {signature.value.abilityLv20}</Text>
                    )}
                    {signature.value.abilityLv30 && (
                      <Text>Lv30: {signature.value.abilityLv30}</Text>
                    )}
                  </VStack>
                </Collapse>
                <Button
                  variant="link"
                  size="sm"
                  onClick={signatureToggle}
                  mt="1rem"
                >
                  Show {isSignatureShow ? "Less" : "More"}
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </Box>
  );
}
