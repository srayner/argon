"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Button from "../../../ui/button/button";
import DataGrid from "../../../ui/datagrid/datagrid";
import Header from "../../../ui/header/header";
import styles from "./page.module.css";

export default function ProductsPage() {
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
      sortable: false,
      flex: 2,
    },
    {
      headerName: "Product",
      field: "name",
      cellRenderer: (params) => {
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
      headerName: "Supplier",
      field: "supplier.name",
      sortable: false,
      flex: 2,
    },
    {
      field: "cost",
      valueFormatter: (p) => {
        if (
          p === undefined ||
          p.value === undefined ||
          typeof p.value !== "number"
        ) {
          return "";
        }
        return "£" + p.value.toFixed(2);
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

    router.push(`${pathname}?${currentParams.toString()}`, { shallow: true });
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Header>
        <div>Products</div>
        <label className={styles.searchLabel}>Search</label>
        <input
          className={styles.searchInput}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
        />
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
}
