"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Form from "@/components/form/Form";
import TextInput from "@/components/form/input/TextInput";
import Select from "@/components/form/select/Select";

const CategoryAddPage: NextPage = () => {
  const addCategorySchema = z.object({
    code: z.string(),
    name: z.string().min(1, { message: "Name is required." }),
    parentId: z.string().nullable(),
  });

  type AddCategorySchema = z.infer<typeof addCategorySchema>;

  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse] = await Promise.all([
          fetch("/api/categories?pageSize=100&sort=name"),
        ]);

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const { data: categories } = await categoriesResponse.json();

        setCategories(categories);
      } catch (error) {
        setError("Failed to fetch data from the API.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = useForm<AddCategorySchema>({
    resolver: zodResolver(addCategorySchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let nextPage = "/dashboard/categories";
    if (response.ok) {
      const newCategory = await response.json();
      nextPage = `/dashboard/categories/${newCategory.id}`;
    }
    router.push(nextPage);
  };

  const parentOptions = [
    { id: "", name: "None - root category" },
    ...categories.map(({ id, name }) => ({ id, name })),
  ];

  return (
    <>
      <Header caption="Add Category" />
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
          <Button color="secondary" href="/dashboard/categories">
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

export default CategoryAddPage;
