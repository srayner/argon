"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../ui/header/header";
import Button from "../../ui/button/button";
import Modal from "../../ui/modal/modal";
import { DetailList, DetailRow } from "../../ui/detail/detail";

export default function ManufacturerDetailPage({ params }) {
  const router = useRouter();
  const supplierId = params.id;
  const [supplier, setSupplier] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <Button size="small">Edit</Button>
        <Button size="small" color="danger" onClick={handleDeleteClick}>
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
