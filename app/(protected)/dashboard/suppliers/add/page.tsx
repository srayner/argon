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

const SupplierAddPage: React.FC = () => {
  const addSupplierSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    website: z.string(),
  });

  type AddSupplierSchema = z.infer<typeof addSupplierSchema>;

  const router = useRouter();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = useForm<AddSupplierSchema>({
    resolver: zodResolver(addSupplierSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch("/api/suppliers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let nextPage = "/dashboard/suppliers";
    if (response.ok) {
      const newSupplier = await response.json();
      nextPage = `/dashboard/suppliers/${newSupplier.id}`;
    }
    router.push(nextPage);
  };

  return (
    <>
      <Header caption="Add Supplier" />

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
          <Button color="secondary" href="/dashboard/suppliers">
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

export default SupplierAddPage;
