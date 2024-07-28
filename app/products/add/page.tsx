"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import Header from "@/app/ui/header/header";
import Button from "@/app/ui/button/button";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProductAddPage: React.FC = () => {
  const addProductSchema = z.object({
    name: z.string().min(1, {message: "Name is required."}),
    manufacturerId: z.number().optional(),
    manufacturerPartNo: z.string().optional(),
    supplierId: z.number().optional(),
    supplierPartNumber: z.string().optional(),
    cost: z.number().optional(),
    qtyInStock: z.number({message: "Quantity is required, but may be zero."}).int(),
    location: z.string().optional()
  });

  type AddProductSchema = z.infer<typeof addProductSchema>;

  const router = useRouter();
  const [manufacturers, setManufacturers] = useState<{ id: number; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from API
        const [manufacturersResponse, suppliersResponse] = await Promise.all([
          fetch('/api/manufacturers'),
          fetch('/api/suppliers')
        ]);

        if (!manufacturersResponse.ok || !suppliersResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const {data: manufacturers } = await manufacturersResponse.json();
        const {data: suppliers } = await suppliersResponse.json();

        setManufacturers(manufacturers);
        setSuppliers(suppliers);
      } catch (error) {
        setError('Failed to fetch data from the API.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const {
    formState: {errors, isSubmitting},
    register,
    handleSubmit
  } = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema)
  });
  
  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    router.push('/products');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  console.log(manufacturers);

  return (
    <>
      <Header>Add Product</Header>

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

        <div className={styles.formItem}>
          <label>Manufacturer</label>
          <select
          {...register("manufacturerId", {valueAsNumber: true})}
          >
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
            {...register("supplierId", {valueAsNumber: true})}
          >
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
            {...register("supplierPartNo", {valueAsNumber: true})}
            type="text"
            autoComplete="off"
          />
        </div>

        <div className={styles.formItem}>
          <label>Cost</label>
          <input
            {...register("cost", {
              setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
            })}
            type="text"
            autocomplete="off"
          />
        </div>

        <div className={styles.formItem}>
          <label>Qty In Stock</label>
          <div>
          <input
            {...register("qtyInStock", {valueAsNumber: true})}
            type="text"
            autoComplete="off"
          />
          {errors.qtyInStock && (
            <p className={styles.errorMessage}>{`${errors.qtyInStock.message}`}</p>
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

        <div className={styles.submitContainer}>
          <Button color="secondary" href="/products">
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

export default ProductAddPage;
