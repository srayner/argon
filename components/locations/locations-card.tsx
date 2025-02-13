import React from "react";
import { MdAddCircle } from "react-icons/md";
import { CardBody, CardHeader } from "../ui/modal/Card/action-card";
import SimpleDataGrid from "../ui/datagrid/SimpleDataGrid";
import { Button } from "../ui/button";
import { Stock } from "@/types/entities";

interface LocationsCardProps {
  stock: Stock[];
  onAdd: () => void;
  onDelete: (stockId: string) => void;
}

const LocationsCard: React.FC<LocationsCardProps> = ({
  stock,
  onAdd,
  onDelete,
}) => {
  const columnDefs = [
    { headerName: "Location", field: "location.name" },
    { headerName: "Qty", field: "qty" },
    {
      headerName: "Actions",
      cellRenderer: "deleteCellRenderer",
      cellRendererParams: {
        onDelete: (rowData: any) => {
          onDelete(rowData.id);
        },
      },
      width: 100,
      menuTabs: [],
    },
  ];

  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader
        title="Stock Locations"
        actions={[
          {
            icon: <MdAddCircle className="text-black-500 text-3xl" />,
            onClick: onAdd,
          },
        ]}
      />
      <CardBody>
        <SimpleDataGrid rowData={stock} columnDefs={columnDefs} />
      </CardBody>
    </div>
  );
};

export default LocationsCard;
