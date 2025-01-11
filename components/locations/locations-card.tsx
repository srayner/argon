import React from "react";
import { CardBody, CardHeader } from "../ui/modal/Card/action-card";

interface LocationsCardProps {}

const LocationsCard: React.FC<LocationsCardProps> = ({}) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader title="Stock Locations" actions={[]} />
      <CardBody>
        <div>Comming soon...</div>
      </CardBody>
    </div>
  );
};

export default LocationsCard;
