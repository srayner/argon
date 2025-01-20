import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import DeleteCellRenderer from "./delete-cell-renderer";
import Styles from "./simple-data-grid.css";

export default function SimpleDataGrid({ columnDefs, rowData }) {
  const components = useMemo(
    () => ({
      deleteCellRenderer: DeleteCellRenderer, // Register your component here
    }),
    []
  );

  return (
    <div className="ag-theme-quartz customGrid" style={{ height: 519 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        components={components}
      />
    </div>
  );
}
