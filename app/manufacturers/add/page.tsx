"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import Header from "@/app/ui/header/header";
import Button from "@/app/ui/button/button";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const ManufacturerAddPage: React.FC = () => {
  const addManufacturerSchema = z.object({
    name: z.string().min(1, {message: "Name is required."}),
  });

  type AddManufacturerSchema = z.infer<typeof addManufacturerSchema>;

  const router = useRouter();
  
  const {
    formState: {errors, isSubmitting},
    register,
    handleSubmit
  } = useForm<AddManufacturerSchema>({
    resolver: zodResolver(addManufacturerSchema)
  });
  
  const onSubmit = async (data: FieldValues) => {
    const response = await fetch('/api/manufacturers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    router.push('/manufacturers');
  };

  return (
    <>
      <Header>Add Manufacturer</Header>

      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>

        <div className={styles.formItem}>
          <label>Name</label>
          <div>
          <input
            {...register("name")}
            type="text"
            autoComplete="off"
          />
          {errors.name && (
            <p className={styles.errorMessage}>{`${errors.name.message}`}</p>
          )}
          </div>
        </div>

        <div className={styles.submitContainer}>
          <Button color="secondary" href="/manufacturers">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Add
          </Button>
        </div>
      </form>
    </>
  );
}

export default ManufacturerAddPage;
