"use client";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Header from "../ui/header/header";
import Button from "../ui/button/button";
import styles from "./page.module.css";

export default function ProductsPage() {
  const fetchData = async (page, pageSize, successCallback) => {
    const response = await fetch(
      `/api/products?page=${page}&pageSize=${pageSize}`
    );
    const { data, meta } = await response.json();
    const lastRow = meta.totalItems;
    successCallback(data, lastRow);
  };

  const onGridReady = (params) => {
    const api = params.api;
    const dataSource = {
      rowCount: null,
      getRows: (params) => {
        const pageSize = api.paginationGetPageSize();
        const page = Math.floor(params.startRow / pageSize) + 1;
        fetchData(page, pageSize, params.successCallback);
      },
    };

    params.api.setGridOption("datasource", dataSource);
    params.api.setGridOption(
      "cacheBlockSize",
      params.api.paginationGetPageSize()
    );
  };

  const onPaginationChanged = (params) => {
    if (params.newPageSize) {
      params.api.setGridOption(
        "cacheBlockSize",
        params.api.paginationGetPageSize()
      );
    }
  };

  const columnDefs = [
    { headerName: "Manufacturer", field: "manufacturer.name", sortable: true },
    { headerName: "Product", field: "name" },
    {
      headerName: "Supplier",
      field: "supplier.name",
      sortable: true,
      sort: "asc",
      flex: 1,
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
    },
    {
      header: "Qty ins stock",
      field: "qtyInStock",
      cellStyle: { textAlign: "right" },
    },
  ];

  return (
    <>
      <Header>Products</Header>
      <div className={styles.actionBar}>
        <form>
          <label className={styles.searchLabel}>Search</label>
          <input className={styles.searchInput} type="text" />
        </form>
        <Button color="primary" size="small" href="/products/add">
          Add
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowModelType={"infinite"}
          pagination={true}
          paginationPageSizeSelector={[10, 20, 50]}
          paginationPageSize={20}
          onGridReady={onGridReady}
          onPaginationChanged={onPaginationChanged}
        />
      </div>
    </>
  );
}
