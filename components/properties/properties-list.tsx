"use client";

import React from "react";
import { MdAddCircle, MdEdit, MdDelete } from "react-icons/md";
import SimpleDataGrid from "../ui/datagrid/SimpleDataGrid";
import { CardHeader, CardBody } from "../ui/modal/Card/action-card";

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
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader
        title="Properties"
        actions={[
          {
            icon: <MdAddCircle className="text-black-500 text-3xl" />,
            onClick: onAddClicked,
          },
        ]}
      />

      <CardBody>
        <SimpleDataGrid rowData={properties} columnDefs={columnDefs} />
      </CardBody>
    </div>
  );
};

export default PropertiesLst;
