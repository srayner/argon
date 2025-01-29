import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import DeleteCellRenderer from "./delete-cell-renderer";
import { any, number } from "zod";

interface SimpleDataGridProps {
  columnDefs: any;
  rowData: any;
  rowHeight?: number;
}

const SimpleDataGrid: React.FC<SimpleDataGridProps> = ({
  columnDefs,
  rowData,
  rowHeight = 42,
}) => {
  const components = useMemo(
    () => ({
      deleteCellRenderer: DeleteCellRenderer,
    }),
    []
  );

  return (
    <div className="ag-theme-quartz customGrid" style={{ height: 519 }}>
      <AgGridReact
        rowData={rowData}
        rowHeight={rowHeight}
        columnDefs={columnDefs}
        components={components}
      />
    </div>
  );
};

export default SimpleDataGrid;
