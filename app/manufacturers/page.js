"use client";

import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Header from "../ui/header/header";

export default function ManufacturersPage() {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([{ field: "name", sortable: true }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/manufacturers");
        const { data } = await response.json();
        setRowData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onPaginationChanged = (params) => {
    console.log(params);
  };
  return (
    <>
      <Header>Manufactuers</Header>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSizeSelector={[2, 5, 10]}
          onPaginationChanged={onPaginationChanged}
        />
      </div>
    </>
  );
}
