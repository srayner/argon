import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Form from "@/components/form/Form";
import NumberInput from "../form/input/NumberInput";
import FetchSelect from "@/components/form/select/FetchSelect";
import SubmitContainer from "@/components/form/SubmitContainer";

interface AddProductStockFormProps {
  productId: number;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const AddProductStockForm: React.FC<AddProductStockFormProps> = ({
  productId,
  onSubmit,
  onCancel,
}) => {
  const addStockSchema = z.object({
    locationId: z.string({ message: "Location is required." }),
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
      body: JSON.stringify({ productId, ...data }),
    });
    onSubmit?.();
  };

  return (
    <Form onSubmit={handleSubmit(processSubmit)}>
      <FetchSelect
        label={"Location"}
        control={control}
        fieldName={"locationId"}
        url={"/api/locations"}
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

export default AddProductStockForm;
