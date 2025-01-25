import { PropertyValue, UnitPosition } from "@/types/entities";

export const formatNumericValue = (
  value: number,
  units: string | null,
  unitPosition: UnitPosition
): string => {
  if (!units) {
    return value.toString();
  }

  if (unitPosition === "PREFIX") {
    return `${units}${value}`;
  }

  if (unitPosition === "SUFFIX") {
    return `${value}${units}`;
  }

  return value.toString();
};

export const formatMetricValue = (
  value: number,
  units: string | null
): string => {
  const prefixes = [
    { factor: 1e12, prefix: "T" }, // Tera (10^12)
    { factor: 1e9, prefix: "G" }, // Giga (10^9)
    { factor: 1e6, prefix: "M" }, // Mega (10^6)
    { factor: 1e3, prefix: "k" }, // Kilo (10^3)
    { factor: 1, prefix: "" }, // Base unit
    { factor: 1e-3, prefix: "m" }, // Milli (10^-3)
    { factor: 1e-6, prefix: "μ" }, // Micro (10^-6)
    { factor: 1e-9, prefix: "n" }, // Nano (10^-9)
    { factor: 1e-12, prefix: "p" }, // Pico (10^-12)
  ];

  let selectedPrefix = "";
  let scaledValue = value;

  for (const { factor, prefix } of prefixes) {
    if (Math.abs(value) >= factor) {
      selectedPrefix = prefix;
      scaledValue = value / factor;
      break;
    }
  }

  const formattedValue =
    scaledValue % 1 === 0 ? scaledValue.toFixed(0) : scaledValue.toFixed(1);

  return `${formattedValue}${selectedPrefix}${units}`;
};

const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  return b === 0 ? a : gcd(b, a % b);
};

const decimalToFraction = (
  value: number,
  precision: 8 | 16 | 32 = 8
): string => {
  const denominator = precision;
  const numerator = Math.round(value * denominator);

  const divisor = gcd(numerator, denominator);
  const simplifiedNumerator = numerator / divisor;
  const simplifiedDenominator = denominator / divisor;

  return `${simplifiedNumerator}/${simplifiedDenominator}`;
};

export const formatImperialValue = (
  value: number,
  units: string | null,
  precision: 8 | 16 | 32 = 8
): string => {
  const wholeNumber = Math.floor(value);
  const fractionalPart = value - wholeNumber;

  if (fractionalPart === 0) {
    return `${wholeNumber}${units}`;
  }

  const fraction = decimalToFraction(fractionalPart, precision);

  if (wholeNumber > 0) {
    return `${wholeNumber}-${fraction}${units}`;
  }

  return `${fraction}${units}`;
};

const formatPropertyValue = (propertyValue: PropertyValue): string => {
  const { property, valueString, valueNumeric } = propertyValue;

  switch (property.type) {
    case "NUMERIC":
      return formatNumericValue(
        valueNumeric,
        property.units,
        property.unitPosition
      );

    case "METRIC":
      return formatMetricValue(valueNumeric, property.units || "");

    case "IMPERIAL":
      return formatImperialValue(valueNumeric, 32);

    default:
      return valueString;
  }
};
