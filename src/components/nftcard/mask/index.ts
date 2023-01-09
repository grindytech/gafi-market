import { NftDto } from "../../../services/types/dtos/Nft.dto";
import HeGearMask from "./HeGearMask";
import HeHeroMask from "./HeHeroMask";

export type MaskProps = {
  nft: NftDto;
};

export const MASKS = {
  he_hero: HeHeroMask,
  he_gear: HeGearMask,
};
