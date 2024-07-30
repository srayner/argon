"use client";

import Button from "../ui/button/button";
import DataGrid from "../ui/datagrid/datagrid";
import Header from "../ui/header/header";
import Link from "next/link";
import styles from "./page.module.css";

export default function ManufacturersPage() {
  const columnDefs = [
    { headerName: "ID", field: "id" },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      cellRenderer: (params) => {
        return params.data ? (
          <Link href={`/manufacturers/${params.data.id}`}>{params.value}</Link>
        ) : (
          ""
        );
      },
    },
  ];

  return (
    <>
      <Header>Manufacturers</Header>
      <div className={styles.actionBar}>
        <form>
          <label className={styles.searchLabel}>Search</label>
          <input className={styles.searchInput} type="text" />
        </form>
        <Button color="primary" size="small" href="/manufacturers/add">
          Add
        </Button>
      </div>
      <DataGrid columnDefs={columnDefs} dataEndpoint="/api/manufacturers" />
    </>
  );
}
