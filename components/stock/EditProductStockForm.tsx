import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Form from "@/components/form/Form";
import NumberInput from "../form/input/NumberInput";
import FetchSelect from "@/components/form/select/FetchSelect";
import SubmitContainer from "@/components/form/SubmitContainer";
import { Stock } from "@/types/entities";

interface EditProductStockFormProps {
  productId: number;
  stock: Stock;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const EditProductStockForm: React.FC<EditProductStockFormProps> = ({
  productId,
  stock,
  onSubmit,
  onCancel,
}) => {
  const editStockSchema = z.object({
    locationId: z.string({ message: "Location is required." }),
    qty: z
      .number({ message: "Qty is required." })
      .min(1, { message: "Quantity must be at least 1." })
      .max(10000, { message: "Quantity cannot exceed 10,000." }),
  });

  type EditStockSchema = z.infer<typeof editStockSchema>;

  const {
    formState: { errors, isSubmitting },
    control,
    register,
    handleSubmit,
    reset,
  } = useForm<EditStockSchema>({
    resolver: zodResolver(editStockSchema),
  });

  const processSubmit = async (data: FieldValues) => {
    const response = await fetch(`/api/stock/${stock.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, ...data }),
    });
    onSubmit?.();
  };

  useEffect(() => {
    reset({
      locationId: stock.location?.id,
      qty: stock.qty,
    });
  }, [reset, stock]);

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
          Edit
        </Button>
      </SubmitContainer>
    </Form>
  );
};

export default EditProductStockForm;
