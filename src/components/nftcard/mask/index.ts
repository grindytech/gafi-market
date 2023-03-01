import configs from "../../../configs";
import { NftDto } from "../../../services/types/dtos/Nft.dto";
import HeGearMask from "./HeGearMask";
import HeHeroMask from "./HeHeroMask";

export type MaskProps = {
  nft: NftDto;
};

export const MASKS = (contract: string) => {
  if (configs.HE_HERO_CONTRACTS.includes(contract)) {
    return HeHeroMask;
  } else if (configs.HE_GEAR_CONTRACTS.includes(contract)) {
    return HeGearMask;
  }
};
