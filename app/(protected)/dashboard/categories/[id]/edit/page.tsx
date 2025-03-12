"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastContext";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import Form from "@/components/form/Form";
import TextInput from "@/components/form/input/TextInput";
import Select from "@/components/form/select/Select";

interface CategoryEditPageProps {
  params: { id: string };
}

const CategoryEditPage: NextPage<CategoryEditPageProps> = ({ params }) => {
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
  const { showToast } = useToast();

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

    if (response.ok) {
      router.push(`/dashboard/categories/${categoryId}`);
    } else {
      const responseData = await response.json();
      showToast(responseData.error || "An error occured.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/categories/${categoryId}`),
          fetch(`/api/categories?pageSize=100&sort=name&exclude=${categoryId}`),
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
      <Header caption="Edit Category" />
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
