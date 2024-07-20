"use client";

import { useForm } from "react-hook-form";
import Header from "@/app/ui/header/header";
import Button from "@/app/ui/button/button";
import styles from "./page.module.css";
import manufacturers from "../../../data/manufacturers.json";
import suppliers from "../../../data/suppliers.json";

export default function ProductAddPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <Header>Add Product</Header>

      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formItem}>
          <label>Name</label>
          <input {...register("name")} type="text" autoComplete="off" />
        </div>

        <div className={styles.formItem}>
          <label>Manufacturer</label>
          <select>
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
          <select>
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
        </div>

        <div className={styles.formItem}>
          <label>Cost</label>
          <input {...register("cost")} type="text" autocomplete="off" />
        </div>

        <div className={styles.formItem}>
          <label>Qty In Stock</label>
          <input
            {...register("qtyInStock")}
            type="text"
            autoComplete="off"
          ></input>
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
