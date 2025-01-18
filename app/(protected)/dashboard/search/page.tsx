import React from "react";
import PropertyValuesFilter from "@/components/property-values/PropertyValuesFilter";

const SearchPage: React.FC = () => {
  const properties = [
    {
      name: "Property 1",
      width: "w-1/4",
      values: [
        { name: "Option 1", value: "option1" },
        { name: "Option 2", value: "option2" },
        { name: "Option 3", value: "option3" },
        { name: "Option 4", value: "option4" },
        { name: "Option 5", value: "option5" },
      ],
    },
    {
      name: "Property 2",
      width: "w-1/4",
      values: [
        { name: "Option 1", value: "option1" },
        { name: "Option 2", value: "option2" },
        { name: "Option 3", value: "option3" },
        { name: "Option 4", value: "option4" },
        { name: "Option 5", value: "option5" },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Advanced Search</h1>
      <PropertyValuesFilter properties={properties} />
    </div>
  );
};

export default SearchPage;
