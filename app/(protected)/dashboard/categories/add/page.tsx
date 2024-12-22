"use client";

import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import SubmitContainer from "@/app/ui/submit-container/submit-container";
import styles from "./page.module.css";

const CategoryAddPage: React.FC = () => {
  const addCategorySchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
  });

  type AddCategorySchema = z.infer<typeof addCategorySchema>;

  const router = useRouter();

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
    router.push("/dashboard/categories");
  };

  return (
    <>
      <Header>Add Category</Header>
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
          <Button color="secondary" href="/dashboard/categories">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Add
          </Button>
        </SubmitContainer>
      </form>
    </>
  );
};

export default CategoryAddPage;
