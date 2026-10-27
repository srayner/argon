import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationStockSchema, LocationStockValues } from "@/schemas";
import Button from "@/app/ui/button/button";
import Form from "@/components/form/Form";
import NumberInput from "../form/input/NumberInput";
import FetchSelect from "@/components/form/select/FetchSelect";
import SubmitContainer from "@/components/form/SubmitContainer";

interface AddLocationStockFormProps {
  locationId: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const AddLocationStockForm: React.FC<AddLocationStockFormProps> = ({
  locationId,
  onSubmit,
  onCancel,
}) => {
  const {
    formState: { errors, isSubmitting },
    control,
    register,
    handleSubmit,
  } = useForm<LocationStockValues>({
    resolver: zodResolver(locationStockSchema),
  });

  const processSubmit = async (data: FieldValues) => {
    const response = await fetch("/api/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locationId, ...data }),
    });
    onSubmit?.();
  };

  return (
    <Form onSubmit={handleSubmit(processSubmit)}>
      <FetchSelect
        label={"Product"}
        control={control}
        fieldName={"productId"}
        url={"/api/products"}
      />

      <NumberInput
        label={"Qty"}
        register={register}
        fieldName={"qty"}
        errors={errors}
      />

      <SubmitContainer>
        <Button color="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Add
        </Button>
      </SubmitContainer>
    </Form>
  );
};

export default AddLocationStockForm;
