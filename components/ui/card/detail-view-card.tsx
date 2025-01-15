import React from "react";
import { CardHeader, CardBody } from "../modal/Card/action-card";

interface Props {}

const DetailViewCard: React.FC<Props> = () => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader title="Details" actions={[]} />
      <CardBody>Comming soon...</CardBody>
    </div>
  );
};

export default DetailViewCard;
