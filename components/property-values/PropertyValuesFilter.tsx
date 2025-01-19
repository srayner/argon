import React, { useState, useEffect } from "react";
import ListBox, { ListBoxOption } from "@/components/ui/listbox";
import { Button } from "@/components/ui/button";

interface PropertyValuesFilterProps {
  properties: Array<{
    name: string;
    width: string;
    propertyValues: Array<{ value: string | number }>;
  }>;
  onRefresh: (newFilterData: any) => void;
}

interface Property {
  name: string;
  width: string;
  values: ListBoxOption[];
}

const PropertiesValueFilter: React.FC<PropertyValuesFilterProps> = ({
  properties,
  onRefresh,
}) => {
  const [filters, setFilters] = useState<Property[]>([]);

  useEffect(() => {
    const transformedFilters = properties.map((property) => ({
      name: property.name,
      width: "",
      values: property.propertyValues.map((value) => ({
        name: value.value.toString(),
        value: value.value,
        selected: false,
      })),
    }));

    setFilters(transformedFilters);
  }, [properties]);

  const handleFilterChange = (
    propertyName: string,
    selectedOption: ListBoxOption
  ) => {
    setFilters((prevFilters) =>
      prevFilters.map((property) =>
        property.name === propertyName
          ? {
              ...property,
              values: property.values.map((value) =>
                value.value === selectedOption.value
                  ? { ...value, selected: selectedOption.selected }
                  : value
              ),
            }
          : property
      )
    );
  };

  const handleReset = () => {
    const resetState = filters.map((property) => ({
      ...property,
      values: property.values.map((value) => ({ ...value, selected: false })),
    }));
    setFilters(resetState);
    onRefresh(resetState);
  };

  const handleSubmit = () => {
    const filterData = filters.reduce((acc, property) => {
      acc[property.name] = property.values.filter((value) => value.selected);
      return acc;
    }, {} as { [key: string]: ListBoxOption[] });

    onRefresh(filterData);
  };

  return (
    <div className="bg-gray-200 p-4">
      <div className="flex space-x-4">
        {filters.map((property, index) => (
          <ListBox
            key={index}
            label={property.name}
            width={property.width}
            options={property.values}
            onChange={handleFilterChange}
          />
        ))}
      </div>
      <div className="flex gap-2 items-start">
        <Button onClick={handleReset}>Reset All</Button>
        <Button onClick={handleSubmit}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default PropertiesValueFilter;
