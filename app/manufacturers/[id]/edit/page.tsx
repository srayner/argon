"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/ui/header/header";
import Button from "@/app/ui/button/button";
import styles from "./page.module.css";

interface ManufacturerEditPageProps {
  params: {
    id: string;
  };
}

const ManufacturerEditPage: React.FC<ManufacturerEditPageProps> = ({params}) => {
  const editManufacturerSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
  });

  type EditManufacturerSchema = z.infer<typeof editManufacturerSchema>;

  const manufacturerId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const {
    formState: {errors, isSubmitting},
    register,
    handleSubmit,
    reset
  } = useForm<EditManufacturerSchema>({
    resolver: zodResolver(editManufacturerSchema)
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch(`/api/manufacturers/${manufacturerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    router.push('/manufacturers');
  };

  useEffect(() => {
    const fetchManufacturer = async () => {
      const response = await fetch(`/api/manufacturers/${manufacturerId}`);
      const manufacturer = await response.json();
      const { id, ...rest } = manufacturer;
      reset(rest);
      setIsLoading(false);
    };
    fetchManufacturer();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header>Edit Manufacturer</Header>
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
            Edit
          </Button>
        </div>
      </form>
    </>
  );
};

export default ManufacturerEditPage;