"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import ConfirmationModal from "@/components/ui/modal/confirmation-modal";
import { DetailViewCard, FieldRow } from "@/components/ui/card/DetailViewCard";
import { Image, Manufacturer } from "@/types/entities";

type Params = { id: string };

type ManufacturerPageProps = {
  params: Params;
};

const ManufacturerDetailPage: NextPage<ManufacturerPageProps> = ({
  params,
}) => {
  const router = useRouter();
  const manufacturerId = params.id;
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleEditClick = () => {
    router.push(`/dashboard/manufacturers/${manufacturerId}/edit`);
  };

  const handleDeleteClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    await fetch(`/api/manufacturers/${manufacturerId}`, {
      method: "DELETE",
    });

    router.push("/dashboard/manufacturers");
  };

  const handleImageChange = async (image: Image) => {
    const response = await fetch(`/api/manufacturers/${manufacturerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId: image.id }),
    });

    if (!response.ok) {
      throw new Error("Failed to update manufacturer image");
    }

    fetchManufacturer();
  };

  const fetchManufacturer = async () => {
    const response = await fetch(`/api/manufacturers/${manufacturerId}`);
    const manufacturer = await response.json();
    setManufacturer(manufacturer);
  };

  useEffect(() => {
    fetchManufacturer();
  }, []);

  if (!manufacturer) return <div>Loading...</div>;

  const fields = [{ label: "Name", value: manufacturer.name }];

  return (
    <>
      <Header caption={manufacturer.name}>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <DetailViewCard
            image={manufacturer.image}
            onImageChange={handleImageChange}
          >
            {fields.map(
              (field, index) =>
                field.value && (
                  <FieldRow key={index} name={field.label}>
                    {field.value}
                  </FieldRow>
                )
            )}
          </DetailViewCard>
        </div>
      </div>

      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="manufacturer"
      />
    </>
  );
};

export default ManufacturerDetailPage;
