"use client";

import { useEffect, useState } from "react";
import Header from "../../ui/header/header";
import Button from "../../ui/button/button";

import { DetailList, DetailRow } from "../../ui/detail/detail";

export default function ManufacturerDetailPage({ params }) {
  const supplierId = params.id;
  const [supplier, setSupplier] = useState(null);

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
        <Button size="small" color="danger">
          Delete
        </Button>
      </Header>
      <DetailList>
        <DetailRow title="Name" value={supplier.name} />
      </DetailList>
    </>
  );
}
