import React from "react";
import { CardBody, CardHeader } from "../ui/modal/Card/action-card";
import SimpleDataGrid from "../ui/datagrid/SimpleDataGrid";
import { Button } from "../ui/button";
import { Stock } from "@/types/entities";

interface LocationsCardProps {
  stock: Stock[];
  onAdd: () => void;
}

const LocationsCard: React.FC<LocationsCardProps> = ({ stock, onAdd }) => {
  const columnDefs = [
    { headerName: "Location", field: "location.name" },
    { headerName: "Qty", field: "qty" },
    {
      headerName: "Actions",
      cellRenderer: "deleteCellRenderer",
      cellRendererParams: {
        onDelete: (rowData: any) => {},
      },
      width: 100,
      menuTabs: [],
    },
  ];

  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader title="Stock Locations" actions={[]} />
      <CardBody>
        <SimpleDataGrid rowData={stock} columnDefs={columnDefs} />
        <Button onClick={() => onAdd()}>Add</Button>
      </CardBody>
    </div>
  );
};

export default LocationsCard;
