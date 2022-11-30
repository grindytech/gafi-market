import { AttributesMapType } from "../enum";

export class GetNftAttributes {
  key: string;
  value?: string[];
  minNumber?: number;
  maxNumber?: number;
  type: AttributesMapType;
}
