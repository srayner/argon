"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/ui/header/header";
import Button from "@/app/ui/button/button";
import styles from "./page.module.css";

interface SupplierEditPageProps {
  params: {
    id: string;
  };
}

const SupplierEditPage: React.FC<SupplierEditPageProps> = ({params}) => {
  const editSupplierSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
  });

  type EditSupplierSchema = z.infer<typeof editSupplierSchema>;

  const supplierId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const {
    formState: {errors, isSubmitting},
    register,
    handleSubmit,
    reset
  } = useForm<EditSupplierSchema>({
    resolver: zodResolver(editSupplierSchema)
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch(`/api/suppliers/${supplierId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    router.push('/suppliers');
  };

  useEffect(() => {
    const fetchSupplier = async () => {
      const response = await fetch(`/api/suppliers/${supplierId}`);
      const supplier = await response.json();
      const { id, ...rest } = supplier;
      reset(rest);
      setIsLoading(false);
    };
    fetchSupplier();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header>Edit Supplier</Header>
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
          <Button color="secondary" href={`/suppliers/${supplierId}`}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Edit
          </Button>
        </div>
      </form>
    </>
  );
};

export default SupplierEditPage;