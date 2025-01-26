import Select from "@/components/form/select";
import TextInput from "@/components/form/text-input";
import NumberInput from "../form/numberInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import SubmitContainer from "@/app/ui/submit-container/submit-container";
import Button from "@/app/ui/button/button";

interface AddStockFormProps {
  productId: number;
  onSubmitCallback?: () => void;
  onCancel?: () => void;
}

const AddStockForm: React.FC<AddStockFormProps> = ({
  productId,
  onSubmitCallback,
  onCancel,
}) => {
  const addStockSchema = z.object({
    productId: z.number(),
    locationId: z.string(),
    qty: z
      .number({ message: "Qty is required." })
      .min(1, { message: "Quantity must be at least 1." })
      .max(10000, { message: "Quantity cannot exceed 10,000." }),
  });

  type AddStockSchema = z.infer<typeof addStockSchema>;

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    watch,
  } = useForm<AddStockSchema>({
    resolver: zodResolver(addStockSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch("/api/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    onSubmitCallback?.();
  };

  const mockLocation = [
    { id: "abc", name: "Location One" },
    { id: "def", name: "Location Two" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Select
        label={"Location"}
        register={register}
        fieldName={"type"}
        isValueNumeric={false}
        options={mockLocation}
        isOptional={false}
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
