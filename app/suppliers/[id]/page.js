"use client";

import { useEffect, useState } from "react";
import Header from "../../ui/header/header";
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
      <Header>{supplier.name}</Header>
      <DetailList>
        <DetailRow title="Name" value={supplier.name} />
      </DetailList>
    </>
  );
}
