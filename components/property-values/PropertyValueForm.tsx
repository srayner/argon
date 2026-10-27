import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPropertyValueSchema, PropertyValueFormData } from "@/schemas";
import Button from "@/app/ui/button/button";
import Form from "@/components/form/Form";
import FormRow from "@/components/form/FormRow";
import Select from "@/components/form/select/Select";
import TextInput from "@/components/form/input/TextInput";
import SubmitContainer from "@/components/form/SubmitContainer";
import { Property } from "@/types/entities";

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
  const propertyValueSchema = createPropertyValueSchema(properties);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PropertyValueFormData>({
    resolver: zodResolver(propertyValueSchema),
    defaultValues: {
      propertyId: properties.length > 0 ? properties[0].id : "",
    },
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
    <Form onSubmit={handleSubmit(submit)} layout="horizontal">
      <FormRow>
        <Select
          register={register}
          fieldName="propertyId"
          isValueNumeric={false}
          options={properties}
          isOptional={false}
          width={200}
        />

        {selectedProperty &&
          ["NUMERIC", "METRIC", "IMPERIAL"].includes(selectedProperty.type) &&
          selectedProperty.units &&
          selectedProperty.unitPosition === "PREFIX" && (
            <span>{selectedProperty.units}</span>
          )}
        <TextInput
          register={register}
          fieldName="value"
          errors={errors}
          width={150}
        />
        {selectedProperty &&
          ["NUMERIC", "METRIC", "IMPERIAL"].includes(selectedProperty.type) &&
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
