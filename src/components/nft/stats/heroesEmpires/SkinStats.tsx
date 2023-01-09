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

export default function SkinStats({ nft }: { nft: NftDto }) {
  const [attributes, setAttributes] = useState<any>({});

  useEffect(() => {
    const attrs = {};
    for (const attr of nft.attributes) {
      attrs[attr.key] = attr.value;
    }
    setAttributes(attrs);
  }, [nft]);
  const { isOpen: isShowStats, onToggle: showStatsToggle } = useDisclosure();
  const { isOpen: isShowBonusStats, onToggle: showBonusStatsToggle } =
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
        {attributes["Bonus Stat"] && (
          <AccordionItem>
            <AccordionButton
              _hover={{ bg: "none" }}
              w="full"
              justifyContent="space-between"
            >
              <Text fontSize="xl" fontWeight="semibold">
                Bonus Stats
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <HeHeroBasicStat
                stats={{
                  BasicStats: attributes["Bonus Stat"],
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
