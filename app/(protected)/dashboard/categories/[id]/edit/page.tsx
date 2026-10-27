"use client";

import { NextPage } from "next";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastContext";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCategorySchema, EditCategoryValues } from "@/schemas";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import FetchSelect from "@/components/form/select/FetchSelect";
import Form from "@/components/form/Form";
import TextInput from "@/components/form/input/TextInput";

interface CategoryEditPageProps {
  params: Promise<{ id: string }>;
}

const CategoryEditPage: NextPage<CategoryEditPageProps> = props => {
  const params = use(props.params);
  const categoryId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();
  const { showToast } = useToast();

  const {
    formState: { errors, isSubmitting },
    control,
    register,
    handleSubmit,
    reset,
  } = useForm<EditCategoryValues>({
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
        const [categoryResponse] = await Promise.all([
          fetch(`/api/categories/${categoryId}`),
        ]);

        if (!categoryResponse) {
          throw new Error("Failed to fetch data");
        }

        const category = await categoryResponse.json();
        const { id, ...rest } = category;
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

        <FetchSelect
          label={"Parent Category"}
          control={control}
          fieldName={"parentId"}
          url={`/api/categories?exclude=${categoryId}`}
          defaultOption={{ value: null, name: "None - root category" }}
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
