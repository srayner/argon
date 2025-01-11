import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Form from "@/components/form/form";
import Select from "@/components/form/select";
import TextInput from "@/components/form/text-input";
import SubmitContainer from "@/app/ui/submit-container/submit-container";
import { Property } from "@/types/entities";
import FormRow from "@/components/form/form-row";

interface PropertyValueFormProps {
  productId: number;
  properties: Property[];
  onSubmit: () => void;
  onClose: () => void;
}

const PropertyValueForm: React.FC<PropertyValueFormProps> = ({
  productId,
  properties,
  onSubmit,
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
    watch,
  } = useForm<PropertyValueFormData>({
    resolver: zodResolver(propertyValueSchema),
  });

  const submit: SubmitHandler<PropertyValueFormData> = async (data) => {
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
    onSubmit();
  };

  const selectedPropertyId = watch("propertyId");
  const selectedProperty = properties.find(
    (prop) => prop.id === selectedPropertyId
  );

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <FormRow>
        <Select
          register={register}
          fieldName="propertyId"
          isValueNumeric={false}
          options={properties}
          isOptional={false}
        />

        {selectedProperty?.type === "NUMERIC" &&
          selectedProperty.units &&
          selectedProperty.unitPosition === "PREFIX" && (
            <span>{selectedProperty.units}</span>
          )}
        <TextInput register={register} fieldName="value" errors={errors} />
        {selectedProperty?.type === "NUMERIC" &&
          selectedProperty.units &&
          selectedProperty.unitPosition === "SUFFIX" && (
            <span>{selectedProperty.units}</span>
          )}
      </FormRow>

      <SubmitContainer>
        <Button color="secondary" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Add
        </Button>
      </SubmitContainer>
    </Form>
  );
};

export default PropertyValueForm;
