"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DetailList, DetailRow } from "@/app/ui/detail/detail";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import ConfirmationModal from "@/components/ui/modal/confirmation-modal";
import PropertiesList from "@/components/properties/properties-list";
import PropertyModal from "@/app/ui/modal/property-modal";

export default function CategoryDetailPage({ params }) {
  const router = useRouter();
  const categoryId = params.id;
  const [category, setCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPropertyModalVisible, setIsPropertyModalVisible] = useState(false);

  const handleEditClick = () => {
    router.push(`/dashboard/categories/${categoryId}/edit`);
  };

  const handleDeleteClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    await fetch(`/api/categories/${categoryId}`, {
      method: "DELETE",
    });

    router.push("/dashboard/categories");
  };

  const handleAddProperty = (newProperty) => {
    setIsPropertyModalVisible(false);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetch(`/api/categories/${categoryId}`);
      const category = await response.json();
      setCategory(category);
    };
    fetchCategory();
  }, [categoryId]);

  if (!category) return <div>Loading...</div>;

  return (
    <>
      <Header>
        <span>{category.name}</span>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>

      <DetailList>
        <DetailRow title="Name" value={category.name} />
        <DetailRow title="Parent Category" value={category.parent?.name} />
      </DetailList>

      <PropertiesList
        properties={category.properties}
        onAddClicked={() => setIsPropertyModalVisible(true)}
      />
      <PropertyModal
        isVisible={isPropertyModalVisible}
        onSubmit={handleAddProperty}
        onClose={() => setIsPropertyModalVisible(false)}
        categoryId={categoryId}
      />

      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="category"
      />
    </>
  );
}
