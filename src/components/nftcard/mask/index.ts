import { NftDto } from "../../../services/types/dtos/Nft.dto";
import HeHeroMask from "./HeHeroMask";

export type MaskProps = {
  nft: NftDto;
};


export const MASKS = {
  he_hero: HeHeroMask,
};
