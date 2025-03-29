"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/app/ui/button/button";
import ExternalLink from "@/components/ui/ExternalLink";
import Header from "@/components/ui/header/Header";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { DetailViewCard, FieldRow } from "@/components/ui/card/DetailViewCard";
import { Supplier, Image } from "@/types/entities";

type Params = { id: string };

type SupplierDetailPageProps = {
  params: Params;
};

const SupplierDetailPage: NextPage<SupplierDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const supplierId = params.id;
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleEditClick = () => {
    router.push(`/dashboard/suppliers/${supplierId}/edit`);
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

    router.push("/dashboard/suppliers");
  };

  const handleImageChange = async (image: Image) => {
    const response = await fetch(`/api/suppliers/${supplierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId: image.id }),
    });

    if (!response.ok) {
      throw new Error("Failed to update supplier image");
    }

    fetchSupplier();
  };

  const fetchSupplier = async () => {
    const response = await fetch(`/api/suppliers/${supplierId}`);
    const supplier = await response.json();
    setSupplier(supplier);
  };

  useEffect(() => {
    fetchSupplier();
  }, [supplierId]);

  if (!supplier) return <div>Loading...</div>;

  const fields = [
    { label: "Name", value: supplier.name },
    { label: "Website", value: supplier.website, link: true },
  ];

  return (
    <>
      <Header caption={supplier.name}>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <DetailViewCard
            image={supplier.image}
            onImageChange={handleImageChange}
          >
            {fields
              .filter((field) => field.value)
              .map((field, index) => (
                <FieldRow key={index} name={field.label}>
                  {field.link && typeof field.value === "string" ? (
                    <ExternalLink href={field.value} />
                  ) : (
                    field.value
                  )}
                </FieldRow>
              ))}
          </DetailViewCard>
        </div>
      </div>

      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="supplier"
      />
    </>
  );
};

export default SupplierDetailPage;
