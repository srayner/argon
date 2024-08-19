"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { FcFactory, FcShipped, FcPackage, FcGallery } from "react-icons/fc";
import { Card } from "@/components/dashboard/card";

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/dashboard");
      const fetchedData = await response.json();
      setData(fetchedData.data);
    };
    fetchData();
  }, []);

  return (
    <main>
      <div>
        <h1 className={styles.heading}>Stock Control</h1>

        <div className="grid grid-cols-2 gap-4">
          <Card
            href="/dashboard/manufacturers"
            icon={FcFactory}
            title="Manufacturers"
            text="Manufacturers make products."
            count={data && data.manufacturers.count}
          />
          <Card
            href="/dashboard/suppliers"
            icon={FcShipped}
            title="Suppliers"
            text="Suppliers sell products."
            count={data && data.suppliers.count}
          />
          <Card
            href="/dashboard/products"
            icon={FcPackage}
            title="Products"
            text="Track your products and their locations."
            count={data && data.products.count}
          />
          <Card
            href="/dashboard/images"
            icon={FcGallery}
            title="Images"
            text="Images can be added to products."
            count={data && data.images.count}
          />
        </div>
      </div>
    </main>
  );
}
