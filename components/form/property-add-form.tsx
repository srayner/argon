import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import Button from "@/app/ui/button/button";
import Select from "@/components/form/select";
import SubmitContainer from "@/components/form/SubmitContainer";
import TextInput from "@/components/form/text-input";

interface PropertyAddFormProps {
  categoryId: string;
  onSubmitCallback?: () => void;
  onCancel?: () => void;
}

const PropertyAddForm: React.FC<PropertyAddFormProps> = ({
  categoryId,
  onSubmitCallback,
  onCancel,
}) => {
  const dataTypes = [
    { id: "STRING", name: "String" },
    { id: "NUMERIC", name: "Numeric" },
    { id: "METRIC", name: "Metric" },
    { id: "IMPERIAL", name: "Imperial" },
  ];

  const unitPositions = [
    { id: "PREFIX", name: "Prefix" },
    { id: "SUFFIX", name: "Suffix" },
  ];

  const addPropertySchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    type: z.string(),
    units: z.string().optional(),
    unitPosition: z.string().optional(),
  });

  type AddPropertySchema = z.infer<typeof addPropertySchema>;

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    watch,
  } = useForm<AddPropertySchema>({
    resolver: zodResolver(addPropertySchema),
  });

  const type = watch("type", "STRING");
  const units = watch("units", "");

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
        isOptional={false}
      />

      {type !== "STRING" && (
        <TextInput
          label={"Units"}
          register={register}
          fieldName={"units"}
          errors={errors}
        />
      )}

      {type !== "STRING" && units && (
        <Select
          label={"Unit Position"}
          register={register}
          fieldName={"unitPosition"}
          isValueNumeric={false}
          options={unitPositions}
          defaultValue={"SUFFIX"}
          isOptional={false}
        />
      )}

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

export default PropertyAddForm;
