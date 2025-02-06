import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  GridApi,
  IGetRowsParams,
  IDatasource,
  PaginationChangedEvent,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

interface DataGridProps {
  columnDefs: ColDef[];
  dataEndpoint: string;
  searchTerm?: string;
}

const DataGrid: React.FC<DataGridProps> = ({
  columnDefs,
  dataEndpoint,
  searchTerm,
}) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const fetchData = async (
    page: number,
    pageSize: number,
    sortParams: string,
    successCallback: (rows: any[], lastRow: number | undefined) => void
  ) => {
    const response = await fetch(
      `${dataEndpoint}?page=${page}&pageSize=${pageSize}&search=${searchTerm}&sort=${sortParams}`
    );
    const { data, meta } = await response.json();
    const lastRow = meta.totalItems;
    successCallback(data, lastRow);
  };

  const buildSortParams = (api: GridApi) => {
    const sortedColumns = api.getColumnState().filter((s) => s.sort !== null);
    return sortedColumns
      .map((column) => {
        const direction = column.sort === "desc" ? "-" : "";
        return `${direction}${column.colId}`;
      })
      .join(",");
  };

  const onGridReady = (gridParams: GridReadyEvent) => {
    setGridApi(gridParams.api);
    const api = gridParams.api;
    const dataSource: IDatasource = {
      getRows: (rowParams: IGetRowsParams) => {
        const pageSize = api.paginationGetPageSize();
        const page = Math.floor(rowParams.startRow / pageSize) + 1;
        const sortParams = buildSortParams(api);
        fetchData(page, pageSize, sortParams, rowParams.successCallback);
      },
    };

    api.setGridOption("datasource", dataSource);
    api.setGridOption("cacheBlockSize", api.paginationGetPageSize());
  };

  const onPaginationChanged = (params: PaginationChangedEvent) => {
    if (params.newPageSize) {
      params.api.setGridOption(
        "cacheBlockSize",
        params.api.paginationGetPageSize()
      );
    }
  };

  useEffect(() => {
    if (gridApi) {
      const dataSource: IDatasource = {
        getRows: (rowParams: IGetRowsParams) => {
          const pageSize = gridApi.paginationGetPageSize();
          const page = Math.floor(rowParams.startRow / pageSize) + 1;
          const sortParams = buildSortParams(gridApi);
          fetchData(page, pageSize, sortParams, rowParams.successCallback);
        },
      };

      gridApi.setGridOption("datasource", dataSource);
    }
  }, [searchTerm, gridApi]);

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
        suppressCellFocus={true}
      />
    </div>
  );
};

export default DataGrid;
