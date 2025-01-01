import Select from "@/components/form/select";
import TextInput from "@/components/form/text-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";

interface PropertyAddFormProps {
  categoryId: string;
  onSubmitCallback?: () => void;
}

const PropertyAddForm: React.FC<PropertyAddFormProps> = ({
  categoryId,
  onSubmitCallback,
}) => {
  const dataTypes = [
    { id: "STRING", name: "String" },
    { id: "NUMERIC", name: "Numeric" },
  ];

  const addPropertySchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    type: z.string(),
    units: z.string().optional(),
  });

  type AddPropertySchema = z.infer<typeof addPropertySchema>;

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = useForm<AddPropertySchema>({
    resolver: zodResolver(addPropertySchema),
  });

  const onSubmit = async (data: FieldValues) => {
    data.categoryId = categoryId;
    const response = await fetch("/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    onSubmitCallback?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label={"Name"}
        register={register}
        fieldName={"name"}
        errors={errors}
      />

      <Select
        label={"Data Type"}
        register={register}
        fieldName={"type"}
        isValueNumeric={false}
        options={dataTypes}
      />

      <TextInput
        label={"Units"}
        register={register}
        fieldName={"units"}
        errors={errors}
      />
    </form>
  );
};

export default PropertyAddForm;
