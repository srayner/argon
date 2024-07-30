"use client";

import { useEffect, useState } from "react";
import Header from "../../ui/header/header";
import { DetailList, DetailRow } from "../../ui/detail/detail";

export default function ManufacturerDetailPage({ params }) {
  const manufacturerId = params.id;
  const [manufacturer, setManufacturer] = useState(null);

  useEffect(() => {
    const fetchManufacturer = async () => {
      const response = await fetch(`/api/manufacturers/${manufacturerId}`);
      const manufacturer = await response.json();
      setManufacturer(manufacturer);
    };
    fetchManufacturer();
  }, [manufacturerId]);

  if (!manufacturer) return <div>Loading...</div>;

  return (
    <>
      <Header>{manufacturer.name}</Header>
      <DetailList>
        <DetailRow title="Name" value={manufacturer.name} />
      </DetailList>
    </>
  );
}
