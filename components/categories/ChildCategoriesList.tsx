"use client";

import React from "react";
import SimpleDataGrid from "../ui/datagrid/SimpleDataGrid";
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
        {categories.length > 0 ? (
          <SimpleDataGrid rowData={categories} columnDefs={columnDefs} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center">
              This category does not have any child categories.
            </p>
          </div>
        )}
      </CardBody>
    </div>
  );
};

export default ChildCategoriesList;
