import React from "react";
import ListBox from "@/components/ui/listbox";
import { Button } from "@/components/ui/button";

interface PropertyValuesFilterProps {
  properties: Array<{
    name: string;
    width: string;
    values: Array<{ value: string }>;
  }>;
}

const PropertiesValueFilter: React.FC<PropertyValuesFilterProps> = ({
  properties,
}) => {
  return (
    <div className="bg-gray-200 p-4">
      <div className="flex space-x-4">
        {properties.map((property, index) => (
          <ListBox
            key={index}
            label={property.name}
            options={property.values}
            width={property.width}
          />
        ))}
      </div>
      <div className="flex gap-2 items-start">
        <Button>Reset All</Button>
        <Button>Apply Filters</Button>
      </div>
    </div>
  );
};

export default PropertiesValueFilter;
