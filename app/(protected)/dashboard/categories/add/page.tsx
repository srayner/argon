"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastContext";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import SubmitContainer from "@/components/form/SubmitContainer";
import FetchSelect from "@/components/form/select/FetchSelect";
import Form from "@/components/form/Form";
import TextInput from "@/components/form/input/TextInput";

const CategoryAddPage: NextPage = () => {
  const addCategorySchema = z.object({
    code: z.string(),
    name: z.string().min(1, { message: "Name is required." }),
    parentId: z.string().nullable().default(null),
  });

  type AddCategorySchema = z.infer<typeof addCategorySchema>;

  const router = useRouter();

  const { showToast } = useToast();

  const {
    formState: { errors, isSubmitting },
    control,
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

    if (response.ok) {
      const newCategory = await response.json();
      router.push(`/dashboard/categories/${newCategory.id}`);
    } else {
      const responseData = await response.json();
      showToast(responseData.error || "An error occured.");
      router.push("/dashboard/categories");
    }
  };

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

        <FetchSelect
          label={"Parent Category"}
          control={control}
          fieldName={"parentId"}
          url={"/api/categories"}
          defaultOption={{ value: null, name: "None - root category" }}
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
