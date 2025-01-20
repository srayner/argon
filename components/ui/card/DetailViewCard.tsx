import React, { ReactNode } from "react";
import { CardHeader, CardBody } from "../modal/Card/action-card";
import EditableImage from "@/components/images/EditableImage";
import { Image } from "@/types/entities";

interface Props {
  image?: Image;
  onImageChange: (image: Image) => void;
  children: React.ReactNode;
}

export const DetailViewCard: React.FC<Props> = ({
  image,
  onImageChange,
  children,
}) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <CardHeader title="Details" actions={[]} />
      <CardBody>
        <div className="grid grid-cols-[300px,1fr]">
          <div className="border-r border-r-[var(--seperator-color)] p-2 min-h-[240px]">
            <EditableImage image={image} onImageChange={onImageChange} />
          </div>
          <div>{children}</div>
        </div>
      </CardBody>
    </div>
  );
};

interface FieldRowProps {
  name: string;
  children: React.ReactNode;
}

export const FieldRow: React.FC<FieldRowProps> = ({ name, children }) => {
  return (
    <div className="grid grid-cols-[250px,1fr] border-b last:border-b-0 pb-4 last:pb-0 ml-4 mb-4 last:mb-0 text-sm">
      <div className="font-bold">{name}</div>
      <div>{children}</div>
    </div>
  );
};
