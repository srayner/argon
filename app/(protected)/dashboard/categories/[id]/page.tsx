"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import ChildCategoriesList from "@/components/categories/ChildCategoriesList";
import PropertiesList from "@/components/properties/PropertiesList";
import PropertyModal from "@/components/properties/PropertyAddModal";
import { Category, Image } from "@/types/entities";
import { DetailViewCard, FieldRow } from "@/components/ui/card/DetailViewCard";

type CategoryDetailPageProps = {
  params: { id: string };
};

const CategoryDetailPage: NextPage<CategoryDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const categoryId = params.id;
  const [category, setCategory] = useState<Category | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isPropertyModalVisible, setIsPropertyModalVisible] =
    useState<boolean>(false);

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

  const handleAddProperty = () => {
    setIsPropertyModalVisible(false);
    fetchCategory();
  };

  const handleImageChange = async (image: Image) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId: image.id }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product image");
    }

    fetchCategory();
  };

  const fetchCategory = async () => {
    const response = await fetch(`/api/categories/${categoryId}`);
    const category = await response.json();
    setCategory(category);
  };

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  if (!category) return <div>Loading...</div>;

  const productFields = [
    { label: "Code", value: category.code },
    { label: "Name", value: category.name },
    {
      label: "Parent Category",
      value: category.parent?.name,
      href: `/dashboard/categories/${category.parent?.id}`,
    },
  ];

  return (
    <>
      <Header caption={category.name}>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <DetailViewCard
            image={category.image}
            onImageChange={handleImageChange}
          >
            {productFields.map(
              (field, index) =>
                field.value && (
                  <FieldRow key={index} name={field.label}>
                    {field.href && <Link href={field.href}>{field.value}</Link>}
                    {!field.href && field.value}
                  </FieldRow>
                )
            )}
          </DetailViewCard>
        </div>
        <PropertiesList
          properties={category.properties}
          onAddClicked={() => setIsPropertyModalVisible(true)}
        />
        <ChildCategoriesList categories={category.children} />
      </div>

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
};

export default CategoryDetailPage;
