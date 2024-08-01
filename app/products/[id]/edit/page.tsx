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

const ProductEditPage: React.FC<ProductEditPageProps> = ({params}) => {
  const editProductSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    manufacturerId: z.number().optional(),
    manufacturerPartNo: z.string().optional(),
    supplierId: z.number().optional(),
    supplierPartNo: z.string().optional(),
    cost: z.number().optional(),
    qtyInStock: z.number({message: "Quantity is required, but may be zero."}).int(),
    location: z.string().optional()
  });

  type EditProductSchema = z.infer<typeof editProductSchema>;

  const productId = params.id;
  const [manufacturers, setManufacturers] = useState<{ id: number; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();
  
  const {
    formState: {errors, isSubmitting},
    register,
    handleSubmit,
    reset
  } = useForm<EditProductSchema>({
    resolver: zodResolver(editProductSchema)
  });

  const onSubmit = async (data: FieldValues) => {
    console.log('submitting');
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    router.push('/products');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, manufacturersResponse, suppliersResponse] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch('/api/manufacturers'),
          fetch('/api/suppliers')
        ]);

        if (!productResponse.ok || !manufacturersResponse.ok || !suppliersResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const product = await productResponse.json();
        const { id, ...rest } = product;
        const {data: manufacturers } = await manufacturersResponse.json();
        const {data: suppliers } = await suppliersResponse.json();

        setManufacturers(manufacturers);
        setSuppliers(suppliers);
        reset(rest);

      } catch (error) {
        setError('Failed to fetch data from the API.');
        console.error('Error:', error);
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
          {errors.manufacturerId && (
            <p className={styles.errorMessage}>{`${errors.manufacturerId.message}`}</p>
          )}
        </div>

        <div className={styles.formItem}>
          <label>Manufactuer Part No</label>
          <input
            {...register("manufacturerPartNo")}
            type="text"
            autoComplete="off"
          />
          {errors.manufacturerPartNo && (
            <p className={styles.errorMessage}>{`${errors.manufacturerPartNo.message}`}</p>
          )}
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
          {errors.supplierId && (
            <p className={styles.errorMessage}>{`${errors.supplierId.message}`}</p>
          )}
        </div>

        <div className={styles.formItem}>
          <label>Supplier Part No</label>
          <input
            {...register("supplierPartNo")}
            type="text"
            autoComplete="off"
          />
          {errors.supplierPartNo && (
            <p className={styles.errorMessage}>{`${errors.supplierPartNo.message}`}</p>
          )}
        </div>

        <div className={styles.formItem}>
          <label>Cost</label>
          <input
            {...register("cost", {
              setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
            })}
            type="text"
            autoComplete="off"
          />
          {errors.cost && (
            <p className={styles.errorMessage}>{`${errors.cost.message}`}</p>
          )}
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
          />
          {errors.location && (
            <p className={styles.errorMessage}>{`${errors.location.message}`}</p>
          )}
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