import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Select from "@/components/form/select";
import TextInput from "@/components/form/text-input";
import SubmitContainer from "@/app/ui/submit-container/submit-container";
import { Property } from "@/types/entities";

interface PropertyValueFormProps {
  productId: number;
  properties: Property[];
  onClose: () => void;
}

const PropertyValueForm: React.FC<PropertyValueFormProps> = ({
  productId,
  properties,
  onClose,
}) => {
  const propertyValueSchema = z
    .object({
      propertyId: z.string().min(1, "Property is required"),
      value: z.string().min(1, "Value is required"),
    })
    .refine(
      ({ propertyId, value }) => {
        const property = properties.find(
          (property) => property.id === propertyId
        );

        // If the property doesn't exist, return false (validation fails)
        if (!property) {
          return false;
        }

        if (value.trim() === "") {
          return false;
        }

        // If the property type is "STRING", ensure the value is a string
        if (property.type === "STRING" && typeof value !== "string") {
          return false;
        }

        // If the property type is numeric (any other type), ensure the value is a valid number
        if (property.type !== "STRING" && isNaN(Number(value))) {
          return false;
        }

        return true;
      },
      () => ({
        path: ["value"],
        message: "`value` must be a number",
      })
    );

  type PropertyValueFormData = z.infer<typeof propertyValueSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyValueFormData>({
    resolver: zodResolver(propertyValueSchema),
  });

  const onSubmit: SubmitHandler<PropertyValueFormData> = async (data) => {
    const property = properties.find(
      (property) => property.id === data.propertyId
    );

    if (!property) {
      console.error("Property not found");
      return;
    }

    const propertyValue = {
      propertyId: property.id,
      valueString: property.type === "STRING" ? data.value : null,
      valueNumeric:
        property.type !== "STRING" && data.value != null
          ? Number(data.value)
          : null,
    };

    try {
      const response = await fetch(
        `/api/products/${productId}/property-values`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(propertyValue),
        }
      );
    } catch (error) {
      console.error("Error submitting property value:", error);
    }

    onClose();
  };

  console.log(properties);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Select
        label="Select Property"
        register={register}
        fieldName="propertyId"
        isValueNumeric={false}
        options={properties}
        isOptional={false}
      />

      <TextInput
        label="Value"
        register={register}
        fieldName="value"
        errors={errors}
      />

      <SubmitContainer>
        <Button color="secondary" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Add
        </Button>
      </SubmitContainer>
    </form>
  );
};

export default PropertyValueForm;
