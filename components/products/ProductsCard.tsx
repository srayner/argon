import React from "react";
import Link from "next/link";
import { MdAddCircle } from "react-icons/md";
import { ICellRendererParams } from "ag-grid-community";
import { CardBody, CardHeader } from "../ui/card/ActionCard";
import SimpleDataGrid from "../ui/datagrid/SimpleDataGrid";
import { Stock } from "@/types/entities";

interface LocationsCardProps {
  stock: Stock[];
  onAdd: () => void;
  onDelete: (stockId: string) => void;
  onEdit: (something: any) => void;
}

const ProductsCard: React.FC<LocationsCardProps> = ({
  stock,
  onAdd,
  onDelete,
  onEdit,
}) => {
  const columnDefs = [
    {
      headerName: "Product",
      field: "product.name",
      cellRenderer: (params: ICellRendererParams) => {
        return params.data ? (
          <Link href={`/dashboard/products/${params.data.product.id}`}>
            {params.value}
          </Link>
        ) : (
          ""
        );
      },
    },
    { headerName: "Qty", field: "qty" },
    {
      headerName: "Actions",
      cellRenderer: "actionCellRenderer",
      cellRendererParams: {
        onDelete: (rowData: any) => {
          onDelete(rowData.id);
        },
        onEdit: (rowData: any) => {
          onEdit(rowData);
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
            e2e: "add-stock-button",
          },
        ]}
      />
      <CardBody>
        <SimpleDataGrid rowData={stock} columnDefs={columnDefs} />
      </CardBody>
    </div>
  );
};

export default ProductsCard;
