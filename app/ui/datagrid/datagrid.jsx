import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function DataGrid({ columnDefs, dataEndpoint }) {
  const fetchData = async (page, pageSize, successCallback) => {
    const response = await fetch(
      `${dataEndpoint}?page=${page}&pageSize=${pageSize}`
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

  return (
    <div className="ag-theme-quartz" style={{ height: 519 }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowModelType={"infinite"}
        pagination={true}
        paginationPageSizeSelector={[10, 20, 50]}
        paginationPageSize={10}
        onGridReady={onGridReady}
        onPaginationChanged={onPaginationChanged}
      />
    </div>
  );
}

