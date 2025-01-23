import { Filter } from "@/components/property-values/PropertyValuesFilter";

type Condition =
  | {
      propertyId: string;
      valueString: { in: string[] };
    }
  | {
      propertyId: string;
      valueNumeric: { in: number[] };
    };

type WhereCondition = {
  propertyValues: {
    some: Condition;
  };
};

export function buildPropertiesSearchObject(filters: Filter[]) {
  const whereConditions: WhereCondition[] = [];
  filters.forEach((filter) => {
    const condition = {
      propertyValues: {
        some:
          filter.type === "STRING"
            ? {
                propertyId: filter.property,
                valueString: {
                  in: filter.values.map((value) => value.toString()),
                },
              }
            : {
                propertyId: filter.property,
                valueNumeric: {
                  in: filter.values.map((value) => Number(value)),
                },
              },
      },
    };

    whereConditions.push(condition);
  });

  return {
    AND: whereConditions,
  };
}
