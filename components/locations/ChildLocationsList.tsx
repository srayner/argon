"use client";

import React from "react";
import SimpleDataGrid from "../ui/datagrid/SimpleDataGrid";
import { CardHeader, CardBody } from "../ui/modal/Card/action-card";

interface ChildLocationsListProps {
  locations: any;
}

const ChildLocationsList: React.FC<ChildLocationsListProps> = ({
  locations,
}) => {
  const columnDefs = [{ headerName: "Name", field: "name" }];

  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader title="Child Locations" actions={[]} />

      <CardBody>
        {locations.length > 0 ? (
          <SimpleDataGrid rowData={locations} columnDefs={columnDefs} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center">
              This location does not have any child locations.
            </p>
          </div>
        )}
      </CardBody>
    </div>
  );
};

export default ChildLocationsList;
