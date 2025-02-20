"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Form from "@/components/form/Form";
import TextInput from "@/components/form/input/TextInput";

interface SupplierEditPageProps {
  params: {
    id: string;
  };
}

const SupplierEditPage: React.FC<SupplierEditPageProps> = ({ params }) => {
  const editSupplierSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
  });

  type EditSupplierSchema = z.infer<typeof editSupplierSchema>;

  const supplierId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<EditSupplierSchema>({
    resolver: zodResolver(editSupplierSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch(`/api/suppliers/${supplierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.push(`/dashboard/suppliers/${supplierId}`);
  };

  useEffect(() => {
    const fetchSupplier = async () => {
      const response = await fetch(`/api/suppliers/${supplierId}`);
      const supplier = await response.json();
      const { id, ...rest } = supplier;
      reset(rest);
      setIsLoading(false);
    };
    fetchSupplier();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header caption="Edit Supplier" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          fieldName="name"
          label="Name"
          register={register}
          errors={errors}
        />

        <SubmitContainer>
          <Button color="secondary" href={`/dashboard/suppliers/${supplierId}`}>
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

export default SupplierEditPage;
