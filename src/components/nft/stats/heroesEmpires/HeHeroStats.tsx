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
import { get } from "lodash";
import { useEffect, useState } from "react";
import { NftDto } from "../../../../services/types/dtos/Nft.dto";
import { getNftImageLink } from "../../../../utils/utils";
import { ImageWithFallback } from "../../../LazyImage";
import HeHeroBasicStat from "./HeHeroBasicStat";

export default function HeHeroStats({ nft }: { nft: NftDto }) {
  const [attributes, setAttributes] = useState<any>({});

  useEffect(() => {
    const attrs = {};
    for (const attr of nft.attributes) {
      attrs[attr.key] = attr.value;
    }
    setAttributes(attrs);
  }, [nft]);

  const { isOpen: isSignatureShow, onToggle: signatureToggle } =
    useDisclosure();
  const { isOpen: skill1Show, onToggle: skill1Toggle } = useDisclosure();
  const { isOpen: skill2Show, onToggle: skill2Toggle } = useDisclosure();

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
        {attributes.Signature && (
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
                <HStack alignItems="start">
                  <ImageWithFallback
                    h="60px"
                    src={attributes?.Signature?.icon}
                  />
                  <VStack spacing={0} fontSize="md" alignItems="start">
                    <HStack spacing={1}>
                      <Text>{attributes.Signature.name}</Text>
                      <Text color="primary.300">
                        Level {attributes.Signature.level}
                      </Text>
                    </HStack>
                    <Collapse startingHeight={20} in={isSignatureShow}>
                      <VStack
                        spacing={1}
                        alignItems="start"
                        fontSize="sm"
                        color="gray.500"
                      >
                        {attributes.Signature.abilityLv0 && (
                          <Text>Lv0: {attributes.Signature.abilityLv0}</Text>
                        )}
                        {attributes.Signature.abilityLv10 && (
                          <Text>Lv10: {attributes.Signature.abilityLv10}</Text>
                        )}
                        {attributes.Signature.abilityLv20 && (
                          <Text>Lv20: {attributes.Signature.abilityLv20}</Text>
                        )}
                        {attributes.Signature.abilityLv30 && (
                          <Text>Lv30: {attributes.Signature.abilityLv30}</Text>
                        )}
                      </VStack>
                    </Collapse>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={signatureToggle}
                      mt="1rem"
                    >
                      {isSignatureShow ? "Less" : "More"}
                    </Button>
                  </VStack>
                </HStack>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        )}
        {attributes.Abilities && (
          <AccordionItem>
            <AccordionButton
              _hover={{ bg: "none" }}
              w="full"
              justifyContent="space-between"
            >
              <Text fontSize="xl" fontWeight="semibold">
                Abilities
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <VStack spacing={3}>
                {get(attributes.Abilities || {}, "Ability-1") && (
                  <HStack alignItems="start" w="full">
                    <ImageWithFallback
                      h="60px"
                      src={get(attributes.Abilities, "Ability-1-Icon")}
                    />
                    <VStack spacing={0} fontSize="md" alignItems="start">
                      <Text>{get(attributes.Abilities, "Ability-1")}</Text>
                      <Collapse startingHeight={20} in={skill1Show}>
                        <VStack>
                          <Text
                            dangerouslySetInnerHTML={{
                              __html:
                                attributes.Abilities["Ability-1-Info-LV1"][
                                  "info"
                                ],
                            }}
                            fontSize="sm"
                            color="gray.500"
                          ></Text>
                        </VStack>
                      </Collapse>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={skill1Toggle}
                        mt="1rem"
                      >
                        {skill1Show ? "Less" : "More"}
                      </Button>
                    </VStack>
                  </HStack>
                )}
                {get(attributes.Abilities || {}, "Ultimates") && (
                  <HStack alignItems="start" w="full">
                    <ImageWithFallback
                      h="60px"
                      src={get(attributes.Abilities, "Ultimates-Icon")}
                    />
                    <VStack
                      spacing={0}
                      fontSize="md"
                      justifyContent="start"
                      alignItems="start"
                    >
                      <Text>{get(attributes.Abilities, "Ultimates")}</Text>
                      <Collapse startingHeight={20} in={skill2Show}>
                        <VStack>
                          <Text
                            dangerouslySetInnerHTML={{
                              __html:
                                attributes.Abilities["Ultimates-Info-LV1"][
                                  "info"
                                ],
                            }}
                            fontSize="sm"
                            color="gray.500"
                          ></Text>
                        </VStack>
                      </Collapse>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={skill2Toggle}
                        mt="1rem"
                      >
                        {skill2Show ? "Less" : "More"}
                      </Button>
                    </VStack>
                  </HStack>
                )}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        )}
        {attributes.BasicStats && (
          <AccordionItem>
            <AccordionButton
              _hover={{ bg: "none" }}
              w="full"
              justifyContent="space-between"
            >
              <Text fontSize="xl" fontWeight="semibold">
                Basic stats
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <HeHeroBasicStat
                stats={{
                  BasicStats: attributes.BasicStats,
                  Fly: attributes["Fly"],
                  Gender: attributes["Gender"],
                }}
                bonusStat={{}}
              />
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </Box>
  );
}
