type CustomProperties = {
  [propertyId: string]: (string | number)[];
};

type WhereCondition = {
  property: {
    id: string;
    type?: string | { not: string };
  };
  valueString?: {
    in: (string | number)[];
  };
  valueNumeric?: {
    in: (string | number)[];
  };
};

type WhereConditions = {
  OR: WhereCondition[];
};

function buildObject(customProperties: string): CustomProperties {
  const cleanedStr = customProperties.slice(1, -1);
  const pairs = cleanedStr.split("],");

  const result: CustomProperties = {};

  pairs.forEach((pair) => {
    const [propertyId, valuesStr] = pair.split("=[");
    const values = valuesStr
      .slice(0, -1)
      .split(",")
      .map((value) => {
        const numValue = Number(value);
        return isNaN(numValue) ? value : numValue;
      });
    result[propertyId] = values;
  });

  return result;
}

function parseCustomProperties(queryParam: string): WhereConditions[] {
  const properties = buildObject(queryParam);
  const whereConditions: WhereConditions[] = [];

  for (const [propertyId, values] of Object.entries(properties)) {
    const valueStringCondition = {
      property: { id: propertyId, type: "STRING" },
      valueString: { in: values.map((value) => value.toString()) },
    };

    const valueNumericCondition = {
      property: { id: propertyId, type: { not: "STRING" } },
      valueNumeric: { in: values },
    };

    whereConditions.push({
      OR: [valueStringCondition, valueNumericCondition],
    });
  }

  return whereConditions;
}
