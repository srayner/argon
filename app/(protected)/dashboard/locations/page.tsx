"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";
import Button from "../../../ui/button/button";
import DataGrid from "../../../ui/datagrid/datagrid";
import Header from "../../../ui/header/header";
import SearchInput from "../../../ui/actionbar/searchInput";

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
    { headerName: "Full Path", field: "fullPathString", flex: 1 },
    { headerName: "Depth", field: "depth" },
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header>
        <div>Locations</div>
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
