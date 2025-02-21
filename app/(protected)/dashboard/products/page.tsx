"use client";

import { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import Button from "../../../ui/button/button";
import DataGrid from "@/components/ui/datagrid/DataGrid";
import Header from "@/components/ui/header/Header";
import SearchInput from "@/components/ui/SearchInput";

type Params = { id: string };

type ProductsPageProps = {
  params: Params;
};

const Products: NextPage<ProductsPageProps> = ({ params }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get("search") || "";
  });

  const columnDefs = [
    {
      headerName: "Manufacturer",
      field: "manufacturer.name",
      flex: 2,
    },
    {
      headerName: "Product",
      field: "name",
      cellRenderer: (params: ICellRendererParams) => {
        return params.data ? (
          <Link href={`/dashboard/products/${params.data.id}`}>
            {params.value}
          </Link>
        ) : (
          ""
        );
      },
      flex: 4,
    },
    {
      headerName: "Category",
      field: "category.name",
      flex: 2,
    },
    {
      headerName: "Supplier",
      field: "supplier.name",
      flex: 2,
    },
    {
      field: "cost",
      valueFormatter: (params: ValueFormatterParams) => {
        if (
          params === undefined ||
          params.value === undefined ||
          typeof params.value !== "number"
        ) {
          return "";
        }
        return "£" + params.value.toFixed(2);
      },
      cellStyle: { textAlign: "right" },
      sortable: true,
      flex: 1,
    },
    {
      header: "Qty in stock",
      field: "qtyInStock",
      cellStyle: { textAlign: "right" },
      flex: 1,
    },
    {
      header: "Location",
      field: "location",
      flex: 1,
    },
  ];

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchTerm !== searchParam) {
      setSearchTerm(searchParam || "");
    }
  }, [searchParams]);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (searchTerm) {
      currentParams.set("search", searchTerm);
    } else {
      currentParams.delete("search");
    }

    router.push(`${pathname}?${currentParams.toString()}`);
  }, [searchTerm]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header caption="Products">
        <SearchInput handleSearchChange={handleSearchChange} />
        <Button color="primary" href="/dashboard/products/add">
          Add
        </Button>
      </Header>
      <DataGrid
        columnDefs={columnDefs}
        dataEndpoint="/api/products"
        searchTerm={searchTerm}
      />
    </>
  );
};

export default Products;
