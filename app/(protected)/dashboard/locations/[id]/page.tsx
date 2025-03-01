"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/app/ui/button/button";
import Header from "@/components/ui/header/Header";
import AddLocationStockModal from "@/components/stock/AddLocationStockModal";
import EditLocationStockModal from "@/components/stock/EditLocationStockModal";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import ChildLocationsList from "@/components/locations/ChildLocationsList";
import ProductsCard from "@/components/products/ProductsCard";
import { Location, Image, Stock } from "@/types/entities";
import { DetailViewCard, FieldRow } from "@/components/ui/card/DetailViewCard";

type Params = { id: string };

type LocationDetailPageProps = {
  params: Params;
};

const CategoryDetailPage: NextPage<LocationDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const locationId = params.id;
  const [location, setLocation] = useState<Location | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState(false);
  const [isEditStockModalVisible, setIsEditStockModalVisible] = useState(false);
  const [stockData, setStockData] = useState<Stock | null>(null);

  const handleEditClick = () => {
    router.push(`/dashboard/locations/${locationId}/edit`);
  };

  const handleDeleteClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmDelete = async () => {
    await fetch(`/api/locations/${locationId}`, {
      method: "DELETE",
    });

    router.push("/dashboard/locations");
  };

  const handleStartEditingStock = (stock: Stock) => {
    setStockData(stock);
    setIsEditStockModalVisible(true);
  };

  const handleImageChange = async (image: Image) => {
    const response = await fetch(`/api/locations/${locationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId: image.id }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product image");
    }

    fetchLocation();
  };

  const handleDeleteStock = async (stockId: string) => {
    await fetch(`/api/stock/${stockId}`, {
      method: "DELETE",
    });
    fetchLocation();
  };

  const fetchLocation = async () => {
    const response = await fetch(`/api/locations/${locationId}`);
    const location = await response.json();
    setLocation(location);
  };

  useEffect(() => {
    fetchLocation();
  }, [locationId]);

  if (!location) return <div>Loading...</div>;

  const productFields = [
    { label: "Code", value: location.code },
    { label: "Name", value: location.name },
    {
      label: "Parent Location",
      value: location.parent?.name,
      href: `/dashboard/locations/${location.parent?.id}`,
    },
  ];

  return (
    <>
      <Header caption={location.name}>
        <Button onClick={handleEditClick}>Edit</Button>
        <Button color="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Header>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <DetailViewCard
            image={location.image}
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
        <ProductsCard
          stock={location.stock}
          onAdd={() => setIsAddStockModalVisible(true)}
          onDelete={handleDeleteStock}
          onEdit={handleStartEditingStock}
        ></ProductsCard>
        <ChildLocationsList locations={location.children} />
      </div>

      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        entityName="location"
      />

      <AddLocationStockModal
        isVisible={isAddStockModalVisible}
        onSubmit={() => {
          setIsAddStockModalVisible(false);
          fetchLocation();
        }}
        onClose={() => setIsAddStockModalVisible(false)}
        location={location}
      />
      {stockData && (
        <EditLocationStockModal
          isVisible={isEditStockModalVisible}
          onSubmit={() => {
            setIsEditStockModalVisible(false);
            fetchLocation();
          }}
          onClose={() => setIsEditStockModalVisible(false)}
          location={location}
          stock={stockData}
        />
      )}
    </>
  );
};

export default CategoryDetailPage;
