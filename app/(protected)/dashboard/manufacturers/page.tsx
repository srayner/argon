"use client";

import { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";
import Button from "../../../ui/button/button";
import DataGrid from "@/components/ui/datagrid/DataGrid";
import Header from "@/components/ui/header/Header";
import SearchInput from "@/components/ui/SearchInput";

const ManufacturersPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const columnDefs = [
    { headerName: "ID", field: "id", flex: 1 },
    {
      headerName: "Name",
      field: "name",
      flex: 4,
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
    { headerName: "Website", field: "website", flex: 4 },
  ];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header caption="Manufacturers">
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
};

export default ManufacturersPage;
