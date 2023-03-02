import configs from "../../../configs";
import GearStats from "./heroesEmpires/GearStats";
import HeHeroStats from "./heroesEmpires/HeHeroStats";
import SkinStats from "./heroesEmpires/SkinStats";


export const STATS = (contract: string) => {
  if (configs.HE_HERO_CONTRACTS.includes(contract)) {
    return HeHeroStats;
  } else if (configs.HE_GEAR_CONTRACTS.includes(contract)) {
    return GearStats;
  } else if (configs.HE_SKIN_CONTRACTS.includes(contract)) {
    return SkinStats;
  }
};