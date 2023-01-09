import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

const heroStatsKeys = {
  "Attack Damage": "Attack Damage",
  "Max HP": "Max HP",
  Defense: "Defense",
  "Attack Range": "Attack Range",
  "Critical Rate": "Critical Rate",
  "Attack Speed": "Attack Speed",
  "Move Speed": "Move Speed",
  Evasion: "Evasion",
  "Physical Resist": "Physical Resist",
  "Magic Resist": "Magic Resist",
  "Life Leech": "Life Leech",
  "Reduce CC": "Reduce CC",
  Recovery: "Recovery",
  Fly: "Fly",
  Gender: "Gender",

  atkDamage: "Attack Damage",
  maxHP: "Max HP",
  defense: "Defense",
  criticalRate: "Critical Rate",
  atkSpeed: "Attack Speed",
  evasion: "Evasion",
  physicalResist: "Physical Resist",
  magicResist: "Magic Resist",
  recovery: "Recovery",

  bonusAtkDamagePercent: "Attack Damage",
  bonusMaxHPPercent: "Max HP",
  bonusDefensePercent: "Defense",
  bonusCriticalRate: "Critical Rate",
  bonusAtkSpeedPercent: "Attack Speed",
  bonusEvasion: "Evasion",
  bonusPhysicResist: "Physical Resist",
  bonusMagicResist: "Magic Resist",

  atkDamagePercent: "Attack Damage",
  critRatePercent: "Critical Rate",
  defensePercent: "Defense",
  evasionPercent: "Evasion",
  magicResistPercent: "Magic Resist",
  physicResistPercent: "Physical Resist",
};
const percentAttr = [
  "bonusAtkDamagePercent",
  "bonusMaxHPPercent",
  "bonusDefensePercent",
  "bonusCriticalRate",
  "bonusAtkSpeedPercent",
  "bonusEvasion",
  "bonusPhysicResist",
  "bonusMagicResist",

  "atkSpeed",
  "criticalRate",
  "physicalResist",
  "magicResist",
  "evasion",

  "atkDamagePercent",
  "critRatePercent",
  "defensePercent",
  "evasionPercent",
  "magicResistPercent",
  "physicResistPercent",
];

const needMul00 = ["bonusAtkSpeedPercent", "atkSpeed"];

const HeroStats = ({
  BasicStats = {},
  keyIndex,
  iconSrc = undefined,
  bonusStat = undefined,
}) =>
  (BasicStats[keyIndex] && BasicStats[keyIndex] !== "0%") ||
  (bonusStat && bonusStat[keyIndex]) ? (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Text fontSize="sm">{heroStatsKeys[keyIndex]}</Text>
      <HStack>
        {iconSrc && (
          <Box mr="4px" display="inline-block">
            <img src={iconSrc} width="28px" height="28px" />
          </Box>
        )}
        <Text>
          {percentAttr.includes(keyIndex)
            ? `${
                Number(BasicStats[keyIndex]) *
                (needMul00.includes(keyIndex) ? 100 : 1)
              }%`
            : BasicStats[keyIndex]}
          {bonusStat && bonusStat[keyIndex] && (
            <Text color="green">+ {bonusStat[keyIndex]}</Text>
          )}
        </Text>
      </HStack>
    </Box>
  ) : (
    <></>
  );
export default function HeHeroBasicStat({
  stats,
  bonusStat,
}: {
  stats: {
    Gender?: string;
    Fly?: string;
    BasicStats: any;
  };
  bonusStat?: any;
}) {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
      alignItems="center"
      gap={2}
      rowGap={3}
    >
      {stats.Gender && (
        <HeroStats
          BasicStats={{
            Gender:
              stats.Gender === "Male" ? (
                <HStack>
                  <Icon as={BsGenderMale} />
                  <Text>{stats.Gender}</Text>
                </HStack>
              ) : (
                <HStack>
                  <Icon as={BsGenderFemale} />
                  <Text>{stats.Gender}</Text>
                </HStack>
              ),
          }}
          keyIndex="Gender"
        />
      )}
      {stats.Fly !== undefined && (
        <HeroStats
          BasicStats={{
            Fly: stats.Fly ? (
              <Icon color="green" as={AiOutlineCheck} />
            ) : (
              <Icon color="red" as={AiOutlineClose} />
            ),
          }}
          keyIndex="Fly"
        />
      )}
      {React.Children.toArray(
        Object.keys(heroStatsKeys).map((statsKey) => {
          return (
            <HeroStats
              BasicStats={stats.BasicStats}
              keyIndex={statsKey}
              iconSrc={`/heroes-empires/stats/${heroStatsKeys[
                statsKey
              ].toLowerCase()}.png`}
              bonusStat={bonusStat}
            />
          );
        })
      )}
    </Box>
  );
}
