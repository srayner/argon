"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DetailList, DetailRow } from "../../ui/detail/detail";
import Button from "../../ui/button/button";
import Header from "../../ui/header/header";
import Modal from "../../ui/modal/modal";

export default function ManufacturerDetailPage({ params }) {
  const router = useRouter();
  const supplierId = params.id;
  const [supplier, setSupplier] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEditClick = () => {
    router.push(`/suppliers/${supplierId}/edit`);
  };

  const handleDeleteClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    await fetch(`/api/suppliers/${supplierId}`, {
      method: "DELETE",
    });

    router.push("/suppliers");
  };

  useEffect(() => {
    const fetchSupplier = async () => {
      const response = await fetch(`/api/suppliers/${supplierId}`);
      const supplier = await response.json();
      setSupplier(supplier);
    };
    fetchSupplier();
  }, [supplierId]);

  if (!supplier) return <div>Loading...</div>;

  return (
    <>
      <Header>
        <span>{supplier.name}</span>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>
      <DetailList>
        <DetailRow title="Name" value={supplier.name} />
      </DetailList>

      <Modal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="supplier"
      />
    </>
  );
}
