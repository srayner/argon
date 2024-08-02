"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DetailList, DetailRow } from "../../ui/detail/detail";
import Button from "../../ui/button/button";
import Header from "../../ui/header/header";
import Modal from "../../ui/modal/modal";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEditClick = () => {
    router.push(`/products/${productId}/edit`);
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

    router.push("/products");
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

  const manufacturer = product.manufacturer;
  const supplier = product.supplier;

  return (
    <>
      <Header>
        <span>{product.name}</span>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>
      <DetailList>
        <DetailRow title="Name" value={product.name} />
        {manufacturer && (
          <DetailRow title="Manufacturer" value={manufacturer.name} />
        )}
        {product.manufacturerPartNo && (
          <DetailRow
            title="Manufacturer Part No"
            value={product.manufacturerPartNo}
          />
        )}
        {supplier && <DetailRow title="Supplier" value={supplier.name} />}
        {product.supplierPartNo && (
          <DetailRow title="Supplier Part No" value={product.supplierPartNo} />
        )}
        {product.cost !== null && (
          <DetailRow
            title="Cost"
            value={product.cost}
            formatter={(v) =>
              v === null || v === "" ? null : "£" + v.toFixed(2)
            }
          />
        )}
        <DetailRow title="Qty In Stock" value={product.qtyInStock} />
        {product.location && (
          <DetailRow title="Location" value={product.location} />
        )}
      </DetailList>

      <Modal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="product"
      />
    </>
  );
}
