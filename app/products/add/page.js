"use client";

import Header from "@/app/ui/header/header";
import Button from "@/app/ui/button/button";
import styles from "./page.module.css";
import manufacturers from "../../../data/manufacturers.json";
import suppliers from "../../../data/suppliers.json";

export default function productAddPage() {
  return (
    <>
      <Header>Add Product</Header>

      <form className={styles.container}>
        <div className={styles.formItem}>
          <label>Name</label>
          <input type="text"></input>
        </div>

        <div className={styles.formItem}>
          <label>Manufacturer</label>
          <select>
            {manufacturers.map((m) => {
              return <option value={m.id}>{m.name}</option>;
            })}
          </select>
        </div>

        <div className={styles.formItem}>
          <label>Manufactuer Part No</label>
          <input type="text"></input>
        </div>

        <div className={styles.formItem}>
          <label>Supplier</label>
          <select>
            {suppliers.map((s) => {
              return <option value={s.id}>{s.name}</option>;
            })}
          </select>
        </div>
        <div className={styles.formItem}>
          <label>Supplier Part No</label>
          <input type="text"></input>
        </div>

        <div className={styles.formItem}>
          <label>Cost</label>
          <input type="text"></input>
        </div>

        <div className={styles.formItem}>
          <label>Qty In Stock</label>
          <input type="text"></input>
        </div>

        <div className={styles.formItem}>
          <label>Location</label>
          <input type="text"></input>
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
