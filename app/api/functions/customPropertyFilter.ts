import { Filter } from "@/components/property-values/PropertyValuesFilter";

type WhereCondition = {
  propertyId: string;
  valueString?: {
    in: (string | number)[];
  };
  valueNumeric?: {
    in: (string | number)[];
  };
};

export function buildPropertiesSearchObject(filters: Filter[]) {
  const whereConditions: WhereCondition[] = [];
  filters.forEach((filter) => {
    const condition =
      filter.type === "STRING"
        ? {
            propertyId: filter.property,
            valueString: { in: filter.values.map((value) => value.toString()) },
          }
        : {
            propertyId: filter.property,
            valueNumeric: { in: filter.values },
          };

    whereConditions.push(condition);
  });

  return {
    propertyValues: {
      some: whereConditions,
    },
  };
}
