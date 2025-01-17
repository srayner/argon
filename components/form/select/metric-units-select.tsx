import React, { ChangeEvent } from "react";

interface MetricUnitsSelectProps {
  symbol: string;
  min: number;
  max: number;
  value?: number;
  onChange?: (value: number) => void;
}

const MetricUnitsSelect: React.FC<MetricUnitsSelectProps> = ({
  symbol,
  min,
  max,
  value = 0,
  onChange,
}) => {
  const siPrefixes: { [key: number]: string } = {
    "24": "Y",
    "21": "Z",
    "18": "E",
    "15": "P",
    "12": "T",
    "9": "G",
    "6": "M",
    "3": "k",
    "0": "",
    "-3": "m",
    "-6": "μ",
    "-9": "n",
    "-12": "p",
    "-15": "f",
    "-18": "a",
  };

  if (symbol === "m") {
    siPrefixes["-2"] = "c";
  }

  const generateOptions = (symbol: string, min: number, max: number) => {
    const options = [];
    for (let exponent = max; exponent >= min; exponent--) {
      const prefix = siPrefixes[exponent];
      if (prefix !== undefined) {
        options.push({
          value: exponent,
          label: `${prefix}${symbol}`,
        });
      }
    }
    return options;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(Number(e.target.value));
    }
  };

  const options = generateOptions(symbol, min, max);

  return (
    <div>
      <label>Metric Units</label>
      <select value={value} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MetricUnitsSelect;
