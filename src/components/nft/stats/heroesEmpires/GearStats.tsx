import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NftDto } from "../../../../services/types/dtos/Nft.dto";
import HeHeroBasicStat from "./HeHeroBasicStat";

export default function GearStats({ nft }: { nft: NftDto }) {
  const [attributes, setAttributes] = useState<any>({});

  useEffect(() => {
    const attrs = {};
    for (const attr of nft.attributes) {
      attrs[attr.key] = attr.value;
    }
    setAttributes(attrs);
  }, [nft]);
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
        {attributes["Base Stats"] && (
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
                  BasicStats: attributes["Base Stats"],
                }}
                bonusStat={{}}
              />
            </AccordionPanel>
          </AccordionItem>
        )}
        {attributes["Bonus Stats"] && (
          <AccordionItem>
            <AccordionButton
              _hover={{ bg: "none" }}
              w="full"
              justifyContent="space-between"
            >
              <Text fontSize="xl" fontWeight="semibold">
                Bonus stats
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <HeHeroBasicStat
                stats={{
                  BasicStats: attributes["Bonus Stats"],
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
