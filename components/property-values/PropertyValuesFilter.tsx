import React, { useState, useEffect } from "react";
import ListBox, { ListBoxOption } from "@/components/ui/listbox";
import { Button } from "@/components/ui/button";

export interface Filter {
  property: string;
  type: string;
  values: (string | number)[];
}

interface PropertyValuesFilterProps {
  properties: Array<{
    id: string;
    name: string;
    type: string;
    width: string;
    propertyValues: Array<{ value: string | number }>;
  }>;
  onRefresh: (newFilterData: Filter[]) => void;
}

interface Property {
  id: string;
  name: string;
  type: string;
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
      id: property.id,
      name: property.name,
      type: property.type,
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
    onRefresh([]);
  };

  const handleSubmit = () => {
    console.log(filters);
    const filterData = filters
      .map((property) => {
        const selectedValues = property.values
          .filter((value) => value.selected)
          .map((value) => value.value);

        if (selectedValues.length > 0) {
          return {
            property: property.id,
            type: property.type,
            values: selectedValues,
          };
        }

        return null;
      })
      .filter(Boolean) as Filter[];

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
