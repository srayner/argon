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

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

const ProductEditPage: React.FC<ProductEditPageProps> = ({ params }) => {
  const editProductSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    manufacturerId: z.number().nullable(),
    manufacturerPartNo: z.string().nullable(),
    supplierId: z.number().nullable(),
    supplierPartNo: z.string().nullable(),
    cost: z.number().nullable(),
    qtyInStock: z
      .number({ message: "Quantity is required, but may be zero." })
      .int(),
    location: z.string().nullable(),
  });

  type EditProductSchema = z.infer<typeof editProductSchema>;

  const productId = params.id;
  const [manufacturers, setManufacturers] = useState<
    { id: number; name: string }[]
  >([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>(
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
  } = useForm<EditProductSchema>({
    resolver: zodResolver(editProductSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.push(`/products/${productId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, manufacturersResponse, suppliersResponse] =
          await Promise.all([
            fetch(`/api/products/${productId}`),
            fetch("/api/manufacturers?pageSize=50"),
            fetch("/api/suppliers?pageSize=50"),
          ]);

        if (
          !productResponse.ok ||
          !manufacturersResponse.ok ||
          !suppliersResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const product = await productResponse.json();
        const { id, ...rest } = product;
        const { data: manufacturers } = await manufacturersResponse.json();
        const { data: suppliers } = await suppliersResponse.json();

        setManufacturers(manufacturers);
        setSuppliers(suppliers);
        reset(rest);
      } catch (error) {
        setError("Failed to fetch data from the API.");
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
      <Header>Edit Product</Header>
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
          {errors.manufacturerId && (
            <p
              className={styles.errorMessage}
            >{`${errors.manufacturerId.message}`}</p>
          )}
        </div>

        <div className={styles.formItem}>
          <label>Manufactuer Part No</label>
          <div>
            <input
              {...register("manufacturerPartNo")}
              type="text"
              autoComplete="off"
            />
            {errors.manufacturerPartNo && (
              <p
                className={styles.errorMessage}
              >{`${errors.manufacturerPartNo.message}`}</p>
            )}
          </div>
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
          {errors.supplierId && (
            <p
              className={styles.errorMessage}
            >{`${errors.supplierId.message}`}</p>
          )}
        </div>

        <div className={styles.formItem}>
          <label>Supplier Part No</label>
          <div>
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
        </div>

        <div className={styles.formItem}>
          <label>Cost</label>
          <div>
            <input
              {...register("cost", {
                setValueAs: (v) =>
                  v === "" || v === null ? null : parseFloat(v),
              })}
              type="text"
              autoComplete="off"
            />
            {errors.cost && (
              <p className={styles.errorMessage}>{`${errors.cost.message}`}</p>
            )}
          </div>
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
          <div>
            <input {...register("location")} type="text" autoComplete="off" />
            {errors.location && (
              <p
                className={styles.errorMessage}
              >{`${errors.location.message}`}</p>
            )}
          </div>
        </div>

        <SubmitContainer>
          <Button color="secondary" href={`/products/${productId}`}>
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

export default ProductEditPage;
