"use client";

import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useState } from "react";
import Header from "../ui/header/header";
import Button from "../ui/button/button";
import data from "../../data/products.json";
import styles from "./page.module.css";

export default function ProductsPage() {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(data);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "manufacturer", sortable: true },
    { field: "product", sortable: true, sort: "asc", flex: 1 },
    { field: "supplier" },
    {
      field: "cost",
      valueFormatter: (p) => "£" + p.value.toFixed(2),
      cellStyle: { textAlign: "right" },
      sortable: true,
    },
  ]);

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

      <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: 500 }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </>
  );
}
