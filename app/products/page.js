"use client";

import Button from "../ui/button/button";
import DataGrid from "../ui/datagrid/datagrid";
import Header from "../ui/header/header";
import styles from "./page.module.css";

export default function ProductsPage() {
  const columnDefs = [
    { headerName: "Manufacturer", field: "manufacturer.name", sortable: true },
    { headerName: "Product", field: "name" },
    {
      headerName: "Supplier",
      field: "supplier.name",
      sortable: true,
      sort: "asc",
      flex: 1,
    },
    {
      field: "cost",
      valueFormatter: (p) => {
        if (
          p === undefined ||
          p.value === undefined ||
          typeof p.value !== "number"
        ) {
          return "";
        }
        return "£" + p.value.toFixed(2);
      },
      cellStyle: { textAlign: "right" },
      sortable: true,
    },
    {
      header: "Qty ins stock",
      field: "qtyInStock",
      cellStyle: { textAlign: "right" },
    },
  ];

  return (
    <>
      <Header>Products</Header>
      <div className={styles.actionBar}>
        <form>
          <label className={styles.searchLabel}>Search</label>
          <input className={styles.searchInput} type="text" />
        </form>
        <Button color="primary" size="small" href="/products/add">
          Add
        </Button>
      </div>

      <DataGrid columnDefs={columnDefs} dataEndpoint="/api/products" />
    </>
  );
}
