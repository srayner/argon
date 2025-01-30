"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";
import Button from "../../../ui/button/button";
import DataGrid from "@/components/ui/datagrid/DataGrid";
import Header from "../../../ui/header/header";
import SearchInput from "@/components/ui/SearchInput";

export default function ManufacturersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const columnDefs = [
    { headerName: "ID", field: "id" },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => {
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

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header>
        <div>Manufacturers</div>
        <SearchInput handleSearchChange={handleSearchChange} />
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
