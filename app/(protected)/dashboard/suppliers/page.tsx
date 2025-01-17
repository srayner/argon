"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";
import Button from "../../../ui/button/button";
import DataGrid from "../../../ui/datagrid/datagrid";
import Header from "../../../ui/header/header";
import styles from "./page.module.css";

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const columnDefs = [
    { headerName: "ID", field: "id" },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => {
        return params.data ? (
          <Link href={`/dashboard/suppliers/${params.data.id}`}>
            {params.value}
          </Link>
        ) : (
          ""
        );
      },
    },
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header>
        <div>Suppliers</div>
        <label className={styles.searchLabel}>Search</label>
        <input
          className={styles.searchInput}
          type="text"
          onChange={handleSearchChange}
        />
        <Button color="primary" href="/dashboard/suppliers/add">
          Add
        </Button>
      </Header>

      <DataGrid
        columnDefs={columnDefs}
        dataEndpoint="/api/suppliers"
        searchTerm={searchTerm}
      />
    </>
  );
}
