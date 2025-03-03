"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";
import Button from "../../../ui/button/button";
import DataGrid from "@/components/ui/datagrid/DataGrid";
import Header from "@/components/ui/header/Header";
import SearchInput from "@/components/ui/SearchInput";

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const columnDefs = [
    { headerName: "Code", field: "code" },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => {
        return params.data ? (
          <Link href={`/dashboard/locations/${params.data.id}`}>
            {params.value}
          </Link>
        ) : (
          ""
        );
      },
    },
    {
      headerName: "Parent",
      field: "parent.name",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => {
        return params.data && params.data.parent ? (
          <Link href={`/dashboard/locations/${params.data.parent.id}`}>
            {params.value}
          </Link>
        ) : (
          ""
        );
      },
    },
    {
      headerName: "Products",
      field: "productCount",
    },
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header caption="Locations">
        <SearchInput handleSearchChange={handleSearchChange} />
        <Button color="primary" href="/dashboard/locations/add">
          Add
        </Button>
      </Header>

      <DataGrid
        columnDefs={columnDefs}
        dataEndpoint="/api/locations"
        searchTerm={searchTerm}
      />
    </>
  );
}
