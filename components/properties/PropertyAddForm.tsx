import { zodResolver } from "@hookform/resolvers/zod";
import { addPropertySchema, AddPropertyValues } from "@/schemas";
import { FieldValues, useForm } from "react-hook-form";
import Button from "@/app/ui/button/button";
import Form from "@/components/form/Form";
import Select from "@/components/form/select/Select";
import SubmitContainer from "@/components/form/SubmitContainer";
import TextInput from "@/components/form/input/TextInput";

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

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    watch,
  } = useForm<AddPropertyValues>({
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
    <Form onSubmit={handleSubmit(onSubmit)}>
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
    </Form>
  );
};

export default PropertyAddForm;
