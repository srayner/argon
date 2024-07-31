"use client";

import Link from "next/link";
import Button from "../ui/button/button";
import DataGrid from "../ui/datagrid/datagrid";
import Header from "../ui/header/header";
import styles from "./page.module.css";

export default function SuppliersPage() {
  const columnDefs = [
    { headerName: "ID", field: "id" },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      cellRenderer: (params) => {
        return params.data ? (
          <Link href={`/suppliers/${params.data.id}`}>{params.value}</Link>
        ) : (
          ""
        );
      },
    },
  ];

  return (
    <>
      <Header>
        <div>Suppliers</div>
        <label className={styles.searchLabel}>Search</label>
        <input className={styles.searchInput} type="text" />
        <Button color="primary" href="/suppliers/add">
          Add
        </Button>
      </Header>

      <DataGrid columnDefs={columnDefs} dataEndpoint="/api/suppliers" />
    </>
  );
}
