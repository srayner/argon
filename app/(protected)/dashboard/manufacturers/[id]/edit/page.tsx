"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/ui/header/Header";
import Button from "@/app/ui/button/button";
import SubmitContainer from "@/components/form/SubmitContainer";
import Form from "@/components/form/Form";
import TextInput from "@/components/form/input/TextInput";

interface ManufacturerEditPageProps {
  params: {
    id: string;
  };
}

const ManufacturerEditPage: React.FC<ManufacturerEditPageProps> = ({
  params,
}) => {
  const editManufacturerSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    website: z.string(),
  });

  type EditManufacturerSchema = z.infer<typeof editManufacturerSchema>;

  const manufacturerId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<EditManufacturerSchema>({
    resolver: zodResolver(editManufacturerSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch(`/api/manufacturers/${manufacturerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.push(`/dashboard/manufacturers/${manufacturerId}`);
  };

  useEffect(() => {
    const fetchManufacturer = async () => {
      const response = await fetch(`/api/manufacturers/${manufacturerId}`);
      const manufacturer = await response.json();
      const { id, ...rest } = manufacturer;
      reset(rest);
      setIsLoading(false);
    };
    fetchManufacturer();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header caption="Edit Manufacturer" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          fieldName="name"
          label="Name"
          register={register}
          errors={errors}
        />

        <TextInput
          fieldName="website"
          label="Website"
          register={register}
          errors={errors}
        />

        <SubmitContainer>
          <Button
            color="secondary"
            href={`/dashboard/manufacturers/${manufacturerId}`}
          >
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Edit
          </Button>
        </SubmitContainer>
      </Form>
    </>
  );
};

export default ManufacturerEditPage;
