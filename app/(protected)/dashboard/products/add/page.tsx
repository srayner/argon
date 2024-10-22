"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import SubmitContainer from "@/app/ui/submit-container/submit-container";
import styles from "./page.module.css";

const ProductAddPage: React.FC = () => {
  const addProductSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
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
        const [manufacturersResponse, suppliersResponse] = await Promise.all([
          fetch("/api/manufacturers?pageSize=50"),
          fetch("/api/suppliers?pageSize=50"),
        ]);

        if (!manufacturersResponse.ok || !suppliersResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const { data: manufacturers } = await manufacturersResponse.json();
        const { data: suppliers } = await suppliersResponse.json();

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
          <label>Manufacturer</label>
          <select
            {...register("manufacturerId", {
              setValueAs: (value) => (!value ? null : Number(value)),
            })}
          >
            <option key="!" value="">
              Unknown
            </option>
            {manufacturers.map((m) => {
              return (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.formItem}>
          <label>Manufactuer Part No</label>
          <input
            {...register("manufacturerPartNo")}
            type="text"
            autoComplete="off"
          />
        </div>

        <div className={styles.formItem}>
          <label>Supplier</label>
          <select
            {...register("supplierId", {
              setValueAs: (value) => (!value ? null : Number(value)),
            })}
          >
            <option key="!" value="">
              Unknown
            </option>
            {suppliers.map((s) => {
              return (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.formItem}>
          <label>Supplier Part No</label>
          <input
            {...register("supplierPartNo")}
            type="text"
            autoComplete="off"
          />
          {errors.supplierPartNo && (
            <p
              className={styles.errorMessage}
            >{`${errors.supplierPartNo.message}`}</p>
          )}
        </div>

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

        <div className={styles.formItem}>
          <label>Location</label>
          <input
            {...register("location")}
            type="text"
            autoComplete="off"
          ></input>
        </div>

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
