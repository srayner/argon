"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../../../ui/button/button";
import DataGrid from "../../../ui/datagrid/datagrid";
import Header from "../../../ui/header/header";
import styles from "./page.module.css";

export default function ManufacturersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const columnDefs = [
    { headerName: "ID", field: "id" },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      cellRenderer: (params) => {
        return params.data ? (
          <Link href={`/dashboard/manufacturers/${params.data.id}`}>
            {params.value}
          </Link>
        ) : (
          ""
        );
      },
    },
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header>
        <div>Manufacturers</div>
        <label className={styles.searchLabel}>Search</label>
        <input
          className={styles.searchInput}
          type="text"
          onChange={handleSearchChange}
        />
        <Button color="primary" href="/dashboard/manufacturers/add">
          Add
        </Button>
      </Header>

      <DataGrid
        columnDefs={columnDefs}
        dataEndpoint="/api/manufacturers"
        searchTerm={searchTerm}
      />
    </>
  );
}
