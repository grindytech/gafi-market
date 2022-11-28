import { AttributesMapType } from "../enum";

export class AttributeMap {
  label: string;
  key: string;
  type: AttributesMapType;
  min?: number;
  max?: number;
  options?: string[];
}
