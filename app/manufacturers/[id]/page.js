"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DetailList, DetailRow } from "../../ui/detail/detail";
import Button from "@/app/ui/button/button";
import Header from "../../ui/header/header";
import Modal from "../../ui/modal/modal";

export default function ManufacturerDetailPage({ params }) {
  const router = useRouter();
  const manufacturerId = params.id;
  const [manufacturer, setManufacturer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEditClick = () => {
    router.push(`/manufacturers/${manufacturerId}/edit`);
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

    router.push("/manufacturers");
  };

  useEffect(() => {
    const fetchManufacturer = async () => {
      const response = await fetch(`/api/manufacturers/${manufacturerId}`);
      const manufacturer = await response.json();
      setManufacturer(manufacturer);
    };
    fetchManufacturer();
  }, [manufacturerId]);

  if (!manufacturer) return <div>Loading...</div>;

  return (
    <>
      <Header>
        <span>{manufacturer.name}</span>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>

      <DetailList>
        <DetailRow title="Name" value={manufacturer.name} />
      </DetailList>

      <Modal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="manufacturer"
      />
    </>
  );
}
