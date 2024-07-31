"use client";

import Link from "next/link";
import Button from "../ui/button/button";
import DataGrid from "../ui/datagrid/datagrid";
import Header from "../ui/header/header";
import styles from "./page.module.css";

export default function ProductsPage() {
  const columnDefs = [
    { headerName: "Manufacturer", field: "manufacturer.name", sortable: true },
    {
      headerName: "Product",
      field: "name",
      cellRenderer: (params) => {
        return params.data ? (
          <Link href={`/products/${params.data.id}`}>{params.value}</Link>
        ) : (
          ""
        );
      },
    },
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
      <Header>
        <div>Products</div>
        <label className={styles.searchLabel}>Search</label>
        <input className={styles.searchInput} type="text" />
        <Button color="primary" href="/products/add">
          Add
        </Button>
      </Header>
      <DataGrid columnDefs={columnDefs} dataEndpoint="/api/products" />
    </>
  );
}
