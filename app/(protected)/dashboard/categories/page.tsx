"use client";

import { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { ICellRendererParams } from "ag-grid-community";
import Button from "../../../ui/button/button";
import DataGrid from "@/components/ui/datagrid/DataGrid";
import Header from "@/components/ui/header/Header";
import SearchInput from "@/components/ui/SearchInput";

const CategoriesPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const columnDefs = [
    { headerName: "Code", field: "code" },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => {
        return params.data ? (
          <Link href={`/dashboard/categories/${params.data.id}`}>
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
          <Link href={`/dashboard/categories/${params.data.parent.id}`}>
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
      <Header caption="Categories">
        <SearchInput handleSearchChange={handleSearchChange} />
        <Button color="primary" href="/dashboard/categories/add">
          Add
        </Button>
      </Header>

      <DataGrid
        columnDefs={columnDefs}
        dataEndpoint="/api/categories"
        searchTerm={searchTerm}
      />
    </>
  );
};

export default CategoriesPage;
