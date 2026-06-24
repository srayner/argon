import { PropertyType } from "@/types/entities";

export type PropertyValueFilter = {
  property: string;
  type: PropertyType;
  values: (string | number)[];
};
