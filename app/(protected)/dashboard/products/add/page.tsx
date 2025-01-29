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
import Select from "@/components/form/select";
import TextInput from "@/components/form/text-input";

const ProductAddPage: React.FC = () => {
  const addProductSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    categoryId: z.string().nullable(),
    manufacturerId: z.number().nullable(),
    manufacturerPartNo: z.string().optional(),
    supplierId: z.number().nullable(),
    supplierPartNo: z.string().optional(),
    cost: z.number().nullable(),
    qtyInStock: z
      .number({ message: "Quantity is required, but may be zero." })
      .int(),
    location: z.string().optional(),
  });

  type AddProductSchema = z.infer<typeof addProductSchema>;

  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [manufacturers, setManufacturers] = useState<
    { id: number; name: string }[]
  >([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, manufacturersResponse, suppliersResponse] =
          await Promise.all([
            fetch("/api/categories?sort=name&pageSize=50"),
            fetch("/api/manufacturers?pageSize=50"),
            fetch("/api/suppliers?pageSize=50"),
          ]);

        if (
          !categoriesResponse.ok ||
          !manufacturersResponse.ok ||
          !suppliersResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const { data: categories } = await categoriesResponse.json();
        const { data: manufacturers } = await manufacturersResponse.json();
        const { data: suppliers } = await suppliersResponse.json();

        setCategories(categories);
        setManufacturers(manufacturers);
        setSuppliers(suppliers);
      } catch (error) {
        setError("Failed to fetch data from the API.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.push("/dashboard/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <>
      <Header>Add Product</Header>

      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label={"Name"}
          register={register}
          fieldName={"name"}
          errors={errors}
        />

        <Select
          label={"Category"}
          register={register}
          fieldName={"categoryId"}
          isValueNumeric={false}
          options={categories}
        />

        <Select
          label={"Manufacturer"}
          register={register}
          fieldName={"manufacturerId"}
          isValueNumeric={true}
          options={manufacturers}
        />

        <TextInput
          label={"Manufacturer Part No"}
          register={register}
          fieldName={"manufacturerPartNo"}
          errors={errors}
        />

        <Select
          label={"Supplier"}
          register={register}
          fieldName={"supplierId"}
          isValueNumeric={true}
          options={suppliers}
        />

        <TextInput
          label={"Supplier Part No"}
          register={register}
          fieldName={"supplierPartNo"}
          errors={errors}
        />

        <div className={styles.formItem}>
          <label>Cost</label>
          <input
            {...register("cost", {
              setValueAs: (v) =>
                v === "" || v === null ? null : parseFloat(v),
            })}
            type="text"
            autoComplete="off"
          />
        </div>

        <div className={styles.formItem}>
          <label>Qty In Stock</label>
          <div>
            <input
              {...register("qtyInStock", { valueAsNumber: true })}
              type="text"
              autoComplete="off"
            />
            {errors.qtyInStock && (
              <p
                className={styles.errorMessage}
              >{`${errors.qtyInStock.message}`}</p>
            )}
          </div>
        </div>

        <TextInput
          label={"Location"}
          register={register}
          fieldName={"location"}
          errors={errors}
        />

        <SubmitContainer>
          <Button color="secondary" href="/dashboard/products">
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

export default ProductAddPage;
