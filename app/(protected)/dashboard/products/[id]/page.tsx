"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import ConfirmationModal from "@/components/ui/modal/confirmation-modal";
import Modal from "@/components/ui/modal/modal";
import PropertyValuesCard from "@/components/property-values/property-values-card";
import PropertyValueForm from "@/components/property-values/property-value-form";
import LocationsCard from "@/components/locations/locations-card";
import { Image, Product, PropertyValue } from "@/types/entities";
import { DetailViewCard, FieldRow } from "@/components/ui/card/detail-view-card";

type Params = { id: string };

type ProductPageProps = {
  params: Params;
};

const ProductDetailPage: NextPage<ProductPageProps> = ({ params }) => {
  const router = useRouter();
  const productId = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPropertyValueModalVisible, setIsPropertyValueModalVisible] = useState(false);

  const handleEditClick = () => {
    router.push(`/dashboard/products/${productId}/edit`);
  };

  const handleDeleteClick = () => {
    setIsModalVisible(true);
  };

  const handleEditPropertyValueClick = (propertyValue: PropertyValue) => {};

  const handleDeletePropertyValueClick = async (propertyValue: PropertyValue) => {
    await fetch(`/api/products/${productId}/property-values/${propertyValue.id}`, {
      method: "DELETE",
    });
    fetchProduct();
  };

  const handleImageChange = async (image: Image) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId: image.id }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product image");
    }

    fetchProduct();
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    router.push("/dashboard/products");
  };

  const showPropertyAddForm = () => {
    setIsPropertyValueModalVisible(true);
  };

  const fetchProduct = async () => {
    const response = await fetch(`/api/products/${productId}`);
    const product = await response.json();
    setProduct(product);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (!product) return <div>Loading...</div>;

  const productFields = [
    { label: "Category", value: product.category?.name },
    { label: "Manufacturer", value: product.manufacturer?.name },
    { label: "Manufacturer Part No", value: product.manufacturerPartNo },
    { label: "Supplier", value: product.supplier?.name },
    { label: "Supplier Part No", value: product.supplierPartNo },
    { label: "Cost", value: product.cost !== null ? "£" + product.cost.toFixed(2) : null },
    { label: "Qty In Stock", value: product.qtyInStock },
    { label: "Location", value: product.location },
  ];

  return (
    <>
      <Header>
        <span>{product.name}</span>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <DetailViewCard image={product.image} onImageChange={handleImageChange}>
            {productFields.map(
              (field, index) =>
                field.value && (
                  <FieldRow key={index} name={field.label}>
                    {field.value}
                  </FieldRow>
                )
            )}
          </DetailViewCard>
        </div>

        <LocationsCard></LocationsCard>
        {product.category && (
          <PropertyValuesCard
            propertyValues={product.propertyValues}
            handleAddClick={showPropertyAddForm}
            handleDeleteClick={handleDeletePropertyValueClick}
            handleEditClick={handleEditPropertyValueClick}
          />
        )}
      </div>

      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="product"
      />

      {product.category && (
        <Modal
          isVisible={isPropertyValueModalVisible}
          onClose={() => setIsPropertyValueModalVisible(false)}
        >
          <h2>Add Property Value</h2>
          <PropertyValueForm
            productId={product.id}
            properties={product.category.properties}
            onSubmit={() => fetchProduct()}
            onClose={() => setIsPropertyValueModalVisible(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default ProductDetailPage;
