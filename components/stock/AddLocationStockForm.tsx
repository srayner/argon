import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const addStockSchema = z.object({
    productId: z.number({ message: "Product is required." }),
    qty: z
      .number({ message: "Qty is required." })
      .min(1, { message: "Quantity must be at least 1." })
      .max(10000, { message: "Quantity cannot exceed 10,000." }),
  });

  type AddStockSchema = z.infer<typeof addStockSchema>;

  const {
    formState: { errors, isSubmitting },
    control,
    register,
    handleSubmit,
  } = useForm<AddStockSchema>({
    resolver: zodResolver(addStockSchema),
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
