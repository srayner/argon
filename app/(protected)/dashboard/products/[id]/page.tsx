"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import Modal from "@/components/ui/modal/Modal";
import PropertyValuesCard from "@/components/property-values/PropertyValuesCard";
import PropertyValueForm from "@/components/property-values/PropertyValueForm";
import LocationsCard from "@/components/locations/LocationsCard";
import { Image, Product, PropertyValue, Stock } from "@/types/entities";
import { DetailViewCard, FieldRow } from "@/components/ui/card/DetailViewCard";
import AddStockModal from "@/components/stock/AddProductStockModal";
import EditStockModal from "@/components/stock/EditProductStockModal";

type Params = { id: string };

type ProductPageProps = {
  params: Params;
};

const ProductDetailPage: NextPage<ProductPageProps> = ({ params }) => {
  const router = useRouter();
  const productId = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPropertyValueModalVisible, setIsPropertyValueModalVisible] =
    useState(false);
  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState(false);
  const [isEditStockModalVisible, setIsEditStockModalVisible] = useState(false);
  const [stockData, setStockData] = useState<Stock | null>(null);

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
    fetchProduct();
  };

  const handleDeleteStock = async (stockId: string) => {
    await fetch(`/api/stock/${stockId}`, {
      method: "DELETE",
    });
    fetchProduct();
  };

  const handleStartEditingStock = (stock: Stock) => {
    setStockData(stock);
    setIsEditStockModalVisible(true);
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
    {
      label: "Category",
      value: product.category?.name,
      href: `/dashboard/categories/${product.category?.id}`,
    },
    { label: "Manufacturer", value: product.manufacturer?.name },
    { label: "Manufacturer Part No", value: product.manufacturerPartNo },
    { label: "Supplier", value: product.supplier?.name },
    { label: "Supplier Part No", value: product.supplierPartNo },
    {
      label: "Cost",
      value: product.cost !== null ? "£" + product.cost.toFixed(2) : null,
    },
    { label: "Qty In Stock", value: product.qtyInStock },
    { label: "Location", value: product.location },
  ];

  return (
    <>
      <Header caption={product.name}>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <DetailViewCard
            image={product.image}
            onImageChange={handleImageChange}
          >
            {productFields.map(
              (field, index) =>
                field.value !== null &&
                field.value !== undefined &&
                field.value !== "" && (
                  <FieldRow key={index} name={field.label}>
                    {field.href && <Link href={field.href}>{field.value}</Link>}
                    {!field.href && field.value}
                  </FieldRow>
                )
            )}
          </DetailViewCard>
        </div>

        <LocationsCard
          stock={product.stock}
          onAdd={() => setIsAddStockModalVisible(true)}
          onDelete={handleDeleteStock}
          onEdit={handleStartEditingStock}
          e2e="stock-locations-panel"
        ></LocationsCard>
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

      <AddStockModal
        isVisible={isAddStockModalVisible}
        onSubmit={() => {
          setIsAddStockModalVisible(false);
          fetchProduct();
        }}
        onClose={() => setIsAddStockModalVisible(false)}
        product={product}
      />

      {stockData && (
        <EditStockModal
          isVisible={isEditStockModalVisible}
          onSubmit={() => {
            setIsEditStockModalVisible(false);
            fetchProduct();
          }}
          onClose={() => setIsEditStockModalVisible(false)}
          product={product}
          stock={stockData}
        />
      )}
    </>
  );
};

export default ProductDetailPage;
