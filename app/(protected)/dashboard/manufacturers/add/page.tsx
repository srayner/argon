"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Form from "@/components/form/Form";
import TextInput from "@/components/form/input/TextInput";

const ManufacturerAddPage: React.FC = () => {
  const addManufacturerSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
  });

  type AddManufacturerSchema = z.infer<typeof addManufacturerSchema>;

  const router = useRouter();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = useForm<AddManufacturerSchema>({
    resolver: zodResolver(addManufacturerSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch("/api/manufacturers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let nextPage = "/dashboard/manufacturers";
    if (response.ok) {
      const newManufacturer = await response.json();
      nextPage = `/dashboard/manufacturers/${newManufacturer.id}`;
    }
    router.push(nextPage);
  };

  return (
    <>
      <Header caption="Add Manufacturer" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          fieldName="name"
          label="Name"
          register={register}
          errors={errors}
        />

        <SubmitContainer>
          <Button color="secondary" href="/dashboard/manufacturers">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Add
          </Button>
        </SubmitContainer>
      </Form>
    </>
  );
};

export default ManufacturerAddPage;
