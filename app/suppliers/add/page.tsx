"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import Header from "@/app/ui/header/header";
import Button from "@/app/ui/button/button";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const SupplierAddPage: React.FC = () => {
  const addSupplierSchema = z.object({
    name: z.string().min(1, {message: "Name is required."}),
  });

  type AddSupplierSchema = z.infer<typeof addSupplierSchema>;

  const router = useRouter();
  
  const {
    formState: {errors, isSubmitting},
    register,
    handleSubmit
  } = useForm<AddSupplierSchema>({
    resolver: zodResolver(addSupplierSchema)
  });
  
  const onSubmit = async (data: FieldValues) => {
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    router.push('/suppliers');
  };

  return (
    <>
      <Header>Add Supplier</Header>

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
          <Button color="secondary" href="/suppliers">
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

export default SupplierAddPage;
