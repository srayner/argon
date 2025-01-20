"use client";

import React from "react";
import { MdAddCircle, MdEdit, MdDelete } from "react-icons/md";
import SimpleDataGrid from "../../app/ui/datagrid/simple-data-grid";
import { CardHeader, CardBody } from "../ui/modal/Card/action-card";

interface ChildCategoriesListProps {
  categories: any;
}

const ChildCategoriesList: React.FC<ChildCategoriesListProps> = ({
  categories,
}) => {
  const columnDefs = [{ headerName: "Name", field: "name" }];

  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader title="Child Categories" actions={[]} />

      <CardBody>
        <SimpleDataGrid rowData={categories} columnDefs={columnDefs} />
      </CardBody>
    </div>
  );
};

export default ChildCategoriesList;
