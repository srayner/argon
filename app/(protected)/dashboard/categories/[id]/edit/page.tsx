"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/app/ui/header/header";
import Button from "@/app/ui/button/button";
import SubmitContainer from "@/app/ui/submit-container/submit-container";
import styles from "./page.module.css";

interface CategoryEditPageProps {
  params: {
    id: string;
  };
}

const CategoryEditPage: React.FC<CategoryEditPageProps> = ({ params }) => {
  const editCategorySchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
  });

  type EditCategorySchema = z.infer<typeof editCategorySchema>;

  const categoryId = params.id;
  const [isLoading, setIsLoading] = useState(true);
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
    const response = await fetch(`/api/category/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.push(`/dashboard/categories/${categoryId}`);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetch(`/api/categories/${categoryId}`);
      const category = await response.json();
      const { id, ...rest } = category;
      reset(rest);
      setIsLoading(false);
    };
    fetchCategory();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header>Edit Category</Header>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formItem}>
          <label>Name</label>
          <div>
            <input {...register("name")} type="text" autoComplete="off" />
            {errors.name && (
              <p className={styles.errorMessage}>{`${errors.name.message}`}</p>
            )}
          </div>
        </div>

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
      </form>
    </>
  );
};

export default CategoryEditPage;
