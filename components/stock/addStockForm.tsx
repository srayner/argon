import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import NumberInput from "../form/input/NumberInput";
import FetchSelect from "@/components/form/select/FetchSelect";
import SubmitContainer from "@/components/form/SubmitContainer";

interface AddStockFormProps {
  productId: number;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const AddStockForm: React.FC<AddStockFormProps> = ({
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
    watch,
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

  const mockLocation = [
    { id: "abc", name: "Location One" },
    { id: "def", name: "Location Two" },
  ];

  return (
    <form onSubmit={handleSubmit(processSubmit)}>
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
    </form>
  );
};

export default AddStockForm;
