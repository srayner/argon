"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";
import Button from "../../../ui/button/button";
import DataGrid from "@/components/ui/datagrid/DataGrid";
import Header from "@/components/ui/header/Header";
import SearchInput from "@/components/ui/SearchInput";

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const columnDefs = [
    { headerName: "ID", field: "id", flex: 2 },
    {
      headerName: "Name",
      field: "name",
      flex: 4,
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
    { headerName: "Website", field: "website", flex: 4 },
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header caption="Suppliers">
        <SearchInput handleSearchChange={handleSearchChange} />
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
