"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Form from "@/components/form/form";
import TextInput from "@/components/form/input/TextInput";
import Select from "@/components/form/select/Select";

interface CategoryEditPageProps {
  params: {
    id: string;
  };
}

const CategoryEditPage: React.FC<CategoryEditPageProps> = ({ params }) => {
  const editCategorySchema = z.object({
    code: z.string(),
    name: z.string().min(1, { message: "Name is required." }),
    parentId: z.string().nullable(),
  });

  type EditCategorySchema = z.infer<typeof editCategorySchema>;

  const categoryId = params.id;
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<EditCategorySchema>({
    resolver: zodResolver(editCategorySchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.push(`/dashboard/categories/${categoryId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/categories/${categoryId}`),
          fetch(`/api/categories?pageSize=50&exclude=${categoryId}`),
        ]);

        if (!categoryResponse || !categoriesResponse) {
          throw new Error("Failed to fetch data");
        }

        const category = await categoryResponse.json();
        const { id, ...rest } = category;
        const { data: categories } = await categoriesResponse.json();

        setCategories(categories);
        reset(rest);
      } catch (error) {
        setError("Failed to fetch data from API.");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const parentOptions = [
    { id: "", name: "None - root category" },
    ...categories.map(({ id, name }) => ({ id, name })),
  ];

  return (
    <>
      <Header>Edit Category</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          fieldName="code"
          label="Code"
          register={register}
          errors={errors}
        />

        <TextInput
          fieldName="name"
          label="Name"
          register={register}
          errors={errors}
        />

        <Select
          label="Parent Category"
          register={register}
          fieldName="parentId"
          isValueNumeric={false}
          isOptional={false}
          options={parentOptions}
        />

        <SubmitContainer>
          <Button
            color="secondary"
            href={`/dashboard/categories/${categoryId}`}
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

export default CategoryEditPage;
