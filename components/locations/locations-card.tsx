import React from "react";
import { CardBody, CardHeader } from "../ui/modal/Card/action-card";
import { Button } from "../ui/button";

interface LocationsCardProps {
  onAdd: () => void;
}

const LocationsCard: React.FC<LocationsCardProps> = ({ onAdd }) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader title="Stock Locations" actions={[]} />
      <CardBody>
        <div>Comming soon...</div>
        <Button onClick={() => onAdd()}>Add</Button>
      </CardBody>
    </div>
  );
};

export default LocationsCard;
