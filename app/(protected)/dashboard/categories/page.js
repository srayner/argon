"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../../../ui/button/button";
import DataGrid from "../../../ui/datagrid/datagrid";
import Header from "../../../ui/header/header";
import SearchInput from "../../../ui/actionbar/searchInput";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const columnDefs = [
    { headerName: "Code", field: "code" },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      cellRenderer: (params) => {
        return params.data ? (
          <Link href={`/dashboard/categories/${params.data.id}`}>{params.value}</Link>
        ) : (
          ""
        );
      },
    },
    {
      headerName: "Parent",
      field: "parent.name",
      flex: 1,
      cellRenderer: (params) => {
        return params.data && params.data.parent ? (
          <Link href={`/dashboard/categories/${params.data.parent.id}`}>{params.value}</Link>
        ) : (
          ""
        );
      },
    },
    { headerName: "Full Path", field: "fullPathString", flex: 1 },
    { headerName: "Depth", field: "depth" },
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header>
        <div>Categories</div>
        <SearchInput handleSearchChange={handleSearchChange} />
        <Button color="primary" href="/dashboard/categories/add">
          Add
        </Button>
      </Header>

      <DataGrid columnDefs={columnDefs} dataEndpoint="/api/categories" searchTerm={searchTerm} />
    </>
  );
}
