"use client";

import Button from "../../app/ui/button/button";
import DataGrid from "../../app/ui/datagrid/datagrid";
import Header from "../../app/ui/header/header";

export default function PropertiesLst({ categoryId, onAddClicked }) {
  const columnDefs = [
    { headerName: "Name", field: "name" },
    { headerName: "Type", field: "type" },
    { headerName: "Units", field: "units" },
  ];

  return (
    <>
      <Header>
        <div>Properties - {categoryId}</div>
        <Button color="primary" onClick={onAddClicked}>
          Add
        </Button>
      </Header>

      <DataGrid
        columnDefs={columnDefs}
        dataEndpoint={`/api/categories/${categoryId}/properties`}
        searchTerm=""
      />
    </>
  );
}
