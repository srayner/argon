"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import SubmitContainer from "@/components/form/SubmitContainer";
import styles from "./page.module.css";

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

  return (
    <>
      <Header>Edit Category</Header>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formItem}>
          <label>Code</label>
          <div>
            <input {...register("code")} type="text" autoComplete="off" />
            {errors.code && (
              <p className={styles.errorMessage}>{`${errors.code.message}`}</p>
            )}
          </div>
        </div>

        <div className={styles.formItem}>
          <label>Name</label>
          <div>
            <input {...register("name")} type="text" autoComplete="off" />
            {errors.name && (
              <p className={styles.errorMessage}>{`${errors.name.message}`}</p>
            )}
          </div>
        </div>

        <div className={styles.formItem}>
          <label>Parent Category</label>
          <select
            {...register("parentId", {
              setValueAs: (value) => (!value ? null : value),
            })}
          >
            <option key="!" value="">
              None - root category
            </option>
            {categories.map((c) => {
              return (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              );
            })}
          </select>
          {errors.parentId && (
            <p
              className={styles.errorMessage}
            >{`${errors.parentId.message}`}</p>
          )}
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
