"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductDetails } from "@/app/ui/details/details";
import Button from "@/app/ui/button/button";
import Header from "@/app/ui/header/header";
import ConfirmationModal from "@/components/ui/modal/confirmation-modal";
import Modal from "@/components/ui/modal/modal";
import PropertyValuesCard from "@/components/property-values/property-values-card";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPropertyValueModalVisible, setIsPropertyValueModalVisible] =
    useState(false);

  const handleEditClick = () => {
    router.push(`/dashboard/products/${productId}/edit`);
  };

  const handleDeleteClick = () => {
    setIsModalVisible(true);
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

  const handleEditPropertyValue = () => {
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

      <ProductDetails product={product} onProductUpdated={setProduct} />

      <Button onClick={handleEditPropertyValue}>Edit Property Value</Button>

      <PropertyValuesCard propertyValues={product.propertyValues} />

      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="product"
      />

      <Modal
        isVisible={isPropertyValueModalVisible}
        onClose={() => setIsPropertyValueModalVisible(false)}
        showCloseCross
      >
        <h2>Edit Property Value</h2>
      </Modal>
    </>
  );
}
