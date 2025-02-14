import React from "react";
import { CardBody, CardHeader } from "../ui/modal/Card/action-card";
import { MdAddCircle, MdEdit, MdDelete } from "react-icons/md";
import { PropertyValue } from "@/types/entities";
import formatPropertyValue from "@/lib/value-formatter";

interface PropertyValuesCardProps {
  propertyValues: PropertyValue[];
  handleAddClick: () => void;
  handleDeleteClick: (propertyValue: PropertyValue) => void;
  handleEditClick: (propertyValue: PropertyValue) => void;
}

const PropertyValuesCard: React.FC<PropertyValuesCardProps> = ({
  propertyValues,
  handleAddClick,
  handleDeleteClick,
  handleEditClick,
}) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader
        title="Custom Properties"
        actions={[
          {
            icon: <MdAddCircle className="text-black-500 text-3xl" />,
            onClick: handleAddClick,
            e2e: "add-property-value-button",
          },
        ]}
      />
      <CardBody>
        <div className="space-y-4">
          {propertyValues.map((propertyValue, index) => (
            <div
              key={propertyValue.id}
              className={`grid grid-cols-2 gap-4 text-sm ${
                index < propertyValues.length - 1 ? "border-b pb-4" : ""
              }`}
            >
              {/* Category Name (Left Column) */}
              <dt className="font-bold text-left">
                {propertyValue.property.name}
              </dt>

              {/* Category Value (Right Column) */}
              <dd className="text-left flex items-center space-x-4">
                {/* Category Value */}
                <span className="flex-grow">
                  {formatPropertyValue(propertyValue)}
                </span>

                {/* Edit Icon */}
                <MdEdit
                  className="text-gray-600 text-blue-400 cursor-pointer hover:text-blue-600 text-xl"
                  onClick={() => handleEditClick(propertyValue)}
                />

                {/* Delete Icon */}
                <MdDelete
                  className="text-gray-600 text-red-400 cursor-pointer hover:text-red-600 text-xl"
                  onClick={() => handleDeleteClick(propertyValue)}
                />
              </dd>
            </div>
          ))}
        </div>
      </CardBody>
    </div>
  );
};

export default PropertyValuesCard;
