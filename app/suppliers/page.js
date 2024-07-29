"use client";

import Button from "../ui/button/button";
import DataGrid from "../ui/datagrid/datagrid";
import Header from "../ui/header/header";
import styles from "./page.module.css";

export default function SuppliersPage() {
  const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Name", field: "name", flex: 1 },
  ];

  return (
    <>
      <Header>Suppliers</Header>
      <div className={styles.actionBar}>
        <form>
          <label className={styles.searchLabel}>Search</label>
          <input className={styles.searchInput} type="text" />
        </form>
        <Button color="primary" size="small" href="/suppliers/add">
          Add
        </Button>
      </div>
      <DataGrid columnDefs={columnDefs} dataEndpoint="/api/suppliers" />
    </>
  );
}
