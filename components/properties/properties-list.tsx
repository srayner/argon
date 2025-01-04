"use client";

import React from "react";
import Button from "../../app/ui/button/button";
import SimpleDataGrid from "../../app/ui/datagrid/simple-data-grid";
import Header from "../../app/ui/header/header";

interface PropertiesLstProps {
  properties: any;
  onAddClicked: () => void;
}

const PropertiesLst: React.FC<PropertiesLstProps> = ({
  properties,
  onAddClicked,
}) => {
  const toTitleCase = (params: any) => {
    return (
      params.value.charAt(0).toUpperCase() + params.value.slice(1).toLowerCase()
    );
  };

  const handleDelete = async (data: any) => {
    await fetch(`/api/properties/${data.id}`, {
      method: "DELETE",
    });
  };

  const columnDefs = [
    { headerName: "Name", field: "name" },
    {
      headerName: "Type",
      field: "type",
      valueFormatter: toTitleCase,
    },
    { headerName: "Units", field: "units" },
    {
      headerName: "Unit Position",
      field: "unitPosition",
      valueFormatter: toTitleCase,
    },
    {
      headerName: "Actions",
      cellRenderer: "deleteCellRenderer",
      cellRendererParams: {
        onDelete: (rowData: any) => handleDelete(rowData),
      },
      width: 100,
      menuTabs: [],
    },
  ];

  return (
    <>
      <Header>
        <div>Properties</div>
        <Button color="primary" onClick={onAddClicked}>
          Add
        </Button>
      </Header>

      <SimpleDataGrid rowData={properties} columnDefs={columnDefs} />
    </>
  );
};

export default PropertiesLst;
