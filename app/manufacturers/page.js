"use client";

import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useState } from "react";
import Header from "../ui/header/header";
import data from "../../data/manufacturers.json";

export default function suppliersPage() {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(data);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([{ field: "name", sortable: true }]);
  return (
    <>
      <Header>Manufactuers</Header>
      <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: 500 }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </>
  );
}
