"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductDetails } from "@/app/ui/details/details";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import ConfirmationModal from "@/components/ui/modal/confirmation-modal";
import Modal from "@/components/ui/modal/modal";
import PropertyValuesCard from "@/components/property-values/property-values-card";
import PropertyValueForm from "@/components/property-values/property-value-form";
import Styles from "./page.module.css";
import LocationsCard from "@/components/locations/locations-card";
import { Product, PropertyValue } from "@/types/entities";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const productId = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPropertyValueModalVisible, setIsPropertyValueModalVisible] =
    useState(false);

  const handleEditClick = () => {
    router.push(`/dashboard/products/${productId}/edit`);
  };

  const handleDeleteClick = () => {
    setIsModalVisible(true);
  };

  const handleEditPropertyValueClick = (propertyValue: PropertyValue) => {};

  const handleDeletePropertyValueClick = async (
    propertyValue: PropertyValue
  ) => {
    await fetch(
      `/api/products/${productId}/property-values/${propertyValue.id}`,
      {
        method: "DELETE",
      }
    );
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

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();
      setProduct(product);
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <Header>
        <span>{product.name}</span>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>

      <div className={Styles.container}>
        <div className={Styles.fullWidth}>
          <ProductDetails product={product} onProductUpdated={setProduct} />
        </div>
        <LocationsCard></LocationsCard>
        <PropertyValuesCard
          propertyValues={product.propertyValues}
          handleAddClick={showPropertyAddForm}
          handleDeleteClick={handleDeletePropertyValueClick}
          handleEditClick={handleEditPropertyValueClick}
        />
      </div>

      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="product"
      />

      <Modal
        isVisible={isPropertyValueModalVisible}
        onClose={() => setIsPropertyValueModalVisible(false)}
      >
        <h2>Add Property Value</h2>
        <PropertyValueForm
          productId={product.id}
          properties={product.category.properties}
          onClose={() => setIsPropertyValueModalVisible(false)}
        />
      </Modal>
    </>
  );
}
